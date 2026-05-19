// Working-from-Lenny MCP UI helper. Inlined into each app HTML at build time.
// Surfaces:
//   window.mcp.callTool(name, args) -> Promise<result>
//   window.mcp.readResource(uri)    -> Promise<{contents, mimeType, text}>
//   window.mcp.onMessage(handler)   -> off()
//
// Transport: postMessage to the host (parent window). Host responses arrive
// with a `requestId` matching the outbound call. The MCP App spec leaves the
// exact wire format up to the host; this helper uses a JSON-RPC-ish envelope
// that Claude Desktop's app surface accepts. If the host returns nothing
// within REQUEST_TIMEOUT_MS, the promise rejects so the UI can show an error.

(function () {
  "use strict";

  var REQUEST_TIMEOUT_MS = 30000;
  var pending = new Object();
  var nextId = 1;

  function isHostFrame() {
    try {
      return window.parent && window.parent !== window;
    } catch (_e) {
      return false;
    }
  }

  function send(method, params) {
    var id = String(nextId++);
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        delete pending[id];
        reject(new Error("MCP request " + method + " timed out"));
      }, REQUEST_TIMEOUT_MS);

      pending[id] = function (msg) {
        clearTimeout(timer);
        if (msg.error) {
          reject(new Error(msg.error.message || "MCP error"));
        } else {
          resolve(msg.result);
        }
      };

      var payload = {
        jsonrpc: "2.0",
        id: id,
        method: method,
        params: params,
      };

      if (isHostFrame()) {
        window.parent.postMessage(payload, "*");
      } else {
        // Local dev: no host. Resolve with a stub so the UI can render.
        clearTimeout(timer);
        delete pending[id];
        reject(
          new Error(
            "No MCP host detected. Open this UI inside Claude Desktop or another MCP App host.",
          ),
        );
      }
    });
  }

  window.addEventListener("message", function (e) {
    var msg = e.data;
    if (!msg || typeof msg !== "object") return;
    if (typeof msg.id !== "string" && typeof msg.id !== "number") return;
    var id = String(msg.id);
    var cb = pending[id];
    if (!cb) return;
    delete pending[id];
    cb(msg);
  });

  var subscribers = [];

  window.addEventListener("message", function (e) {
    var msg = e.data;
    if (!msg || typeof msg !== "object" || msg.id != null) return;
    // Notifications (no id) get fanned out to subscribers.
    subscribers.forEach(function (h) {
      try {
        h(msg);
      } catch (_err) {
        // Swallow handler errors so one bad subscriber doesn't break others.
      }
    });
  });

  window.mcp = {
    callTool: function (name, args) {
      return send("tools/call", { name: name, arguments: args });
    },
    readResource: function (uri) {
      return send("resources/read", { uri: uri });
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
