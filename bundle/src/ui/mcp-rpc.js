// Working-from-Lenny MCP Apps UI bridge. Inlined into each app HTML at build
// time. Implements the iframe side of the MCP Apps UI protocol (ext-apps
// SEP-1865, profile=mcp-app, protocolVersion=2026-01-26).
//
// Why this exists at all: the host (Claude Desktop, ChatGPT, etc.) mounts the
// iframe but waits for it to send `ui/initialize` before considering it ready.
// Until then the iframe is invisible and inert — host-bound calls like
// tools/call are buffered or dropped, and the iframe stays at 0px because no
// `ui/notifications/size-changed` has been sent. Skipping the handshake is the
// most common "iframe mounted but blank" failure mode.
//
// Surfaces:
//   window.mcp.ready                 -> Promise<HostContext>
//   window.mcp.callTool(name, args)  -> Promise<result>
//   window.mcp.readResource(uri)     -> Promise<{contents, mimeType, text}>
//   window.mcp.onMessage(handler)    -> off()  // host -> iframe notifications
//   window.mcp.hostContext           -> object | undefined  // theme, viewport
//
// All host-bound calls await the init handshake internally, so app code can
// call window.mcp.callTool(...) at any time without ordering concerns.

(function () {
  "use strict";

  // __WFL_BUNDLE_VERSION__ is replaced by build-html.ts at inline time with
  // the version from bundle/manifest.json. Stays in sync automatically; if
  // the build step is skipped the literal string is announced to the host
  // (visible in Desktop debug logs) which makes the misconfiguration obvious.
  var APP_INFO = { name: "Working from Lenny", version: "__WFL_BUNDLE_VERSION__" };
  var PROTOCOL_VERSION = "2026-01-26";
  // Default timeout for tool calls and resource reads. ui/initialize gets a
  // longer budget (INIT_TIMEOUT_MS) because the host may still be wiring up
  // on first iframe mount.
  var REQUEST_TIMEOUT_MS = 30000;
  var INIT_TIMEOUT_MS = 90000;

  var pending = Object.create(null);
  var subscribers = [];
  var nextId = 1;
  var hostContext;
  var initializedSent = false;

  function isHostFrame() {
    try {
      return window.parent && window.parent !== window;
    } catch (_e) {
      return false;
    }
  }

  function postToHost(payload) {
    // Target "*" mirrors the reference SDK (PostMessageTransport defaults).
    // Host-side filters on event.source so origin laxness here doesn't widen
    // the trust boundary; the iframe is already inside the host's sandbox.
    window.parent.postMessage(payload, "*");
  }

  function request(method, params, timeoutOverrideMs) {
    var id = nextId++;
    var timeoutMs = timeoutOverrideMs || REQUEST_TIMEOUT_MS;
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        delete pending[id];
        reject(new Error("MCP request " + method + " timed out after " + timeoutMs + "ms"));
      }, timeoutMs);

      pending[id] = function (msg) {
        clearTimeout(timer);
        if (msg.error) {
          reject(new Error(msg.error.message || "MCP error"));
        } else {
          resolve(msg.result);
        }
      };

      postToHost({ jsonrpc: "2.0", id: id, method: method, params: params });
    });
  }

  function notify(method, params) {
    postToHost({ jsonrpc: "2.0", method: method, params: params });
  }

  // Inbound dispatch. Responses (have id, match a pending request) resolve the
  // corresponding promise. Notifications (no id) fan out to subscribers.
  window.addEventListener("message", function (e) {
    if (e.source !== window.parent) return;
    var msg = e.data;
    if (!msg || typeof msg !== "object") return;
    if (msg.jsonrpc !== "2.0") return;

    if (msg.id != null) {
      var cb = pending[msg.id];
      if (!cb) return;
      delete pending[msg.id];
      cb(msg);
      return;
    }

    // Notification. Cache host-context updates so app code can read theme
    // changes without re-registering listeners.
    if (msg.method === "ui/notifications/host-context-changed" && msg.params && msg.params.hostContext) {
      hostContext = msg.params.hostContext;
    }
    subscribers.forEach(function (h) {
      try { h(msg); } catch (_err) { /* one bad subscriber shouldn't break others */ }
    });
  });

  // Size announcement. Mirrors the SDK's approach: temporarily set
  // documentElement.height to max-content so getBoundingClientRect returns the
  // content height rather than the viewport-clamped value. Without this hack,
  // `<html>` reports the iframe's own height (0) instead of its content.
  var lastWidth = 0;
  var lastHeight = 0;
  // null sentinel (not 0): requestAnimationFrame is spec-permitted to return
  // 0 as a handle, and a falsy-zero `if (sizeRaf) return;` guard would let a
  // second concurrent rAF queue and defeat coalescing.
  var sizeRaf = null;

  function measureAndSend() {
    if (sizeRaf !== null) return;
    sizeRaf = requestAnimationFrame(function () {
      sizeRaf = null;
      var html = document.documentElement;
      var originalHeight = html.style.height;
      html.style.height = "max-content";
      var height = Math.ceil(html.getBoundingClientRect().height);
      html.style.height = originalHeight;
      var width = Math.ceil(window.innerWidth);
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;
      if (initializedSent) {
        notify("ui/notifications/size-changed", { width: width, height: height });
      }
    });
  }

  function setupResizeObserver() {
    measureAndSend();
    if (typeof ResizeObserver === "function") {
      // Observe documentElement only. Observing body in addition fired the
      // callback twice per layout shift (once per target); rAF coalescing
      // hid the double-emit but the observer callback itself still ran
      // twice per change — wasted work on animation-heavy frames.
      var ro = new ResizeObserver(measureAndSend);
      ro.observe(document.documentElement);
    } else {
      // Fallback for older runtimes: poll every 250ms.
      setInterval(measureAndSend, 250);
    }
  }

  // Init handshake. Sequence: send `ui/initialize`, await result, send
  // `ui/notifications/initialized`, then start size announcements. Until
  // initializedSent is true, host may not accept host-bound calls (warns on
  // strict hosts, silently drops on others), so all app-facing methods await
  // window.mcp.ready before sending.
  var readyResolve;
  var readyReject;
  var readyPromise = new Promise(function (res, rej) { readyResolve = res; readyReject = rej; });

  function performHandshake() {
    if (!isHostFrame()) {
      readyReject(new Error("No MCP host detected. Open this UI inside Claude Desktop or another MCP App host."));
      return;
    }
    request("ui/initialize", {
      appInfo: APP_INFO,
      appCapabilities: {},
      protocolVersion: PROTOCOL_VERSION,
    }, INIT_TIMEOUT_MS).then(function (result) {
      hostContext = (result && result.hostContext) || {};
      notify("ui/notifications/initialized", {});
      initializedSent = true;
      setupResizeObserver();
      readyResolve(hostContext);
    }).catch(function (err) {
      readyReject(err);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", performHandshake);
  } else {
    performHandshake();
  }

  window.mcp = {
    ready: readyPromise,
    get hostContext() { return hostContext; },
    callTool: function (name, args) {
      return readyPromise.then(function () {
        return request("tools/call", { name: name, arguments: args });
      });
    },
    readResource: function (uri) {
      return readyPromise.then(function () {
        return request("resources/read", { uri: uri });
      });
    },
    // Send a chat message on the user's behalf. Triggers the host chat model
    // to respond — the right surface for "I just scored an audit, please
    // narrate." Spec: ui/message, role currently fixed to "user".
    sendMessage: function (text) {
      return readyPromise.then(function () {
        return request("ui/message", {
          role: "user",
          content: [{ type: "text", text: text }],
        });
      });
    },
    // Push silent context for the next model turn. Unlike sendMessage, this
    // does not appear as a user message and does not trigger a response on
    // its own — pair it with sendMessage to make the model act. Spec:
    // ui/update-model-context. Each call overwrites the previous context.
    updateModelContext: function (params) {
      return readyPromise.then(function () {
        return request("ui/update-model-context", params || {});
      });
    },
    onMessage: function (handler) {
      subscribers.push(handler);
      return function off() {
        var i = subscribers.indexOf(handler);
        if (i >= 0) subscribers.splice(i, 1);
      };
    },
  };
})();
