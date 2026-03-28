if (typeof process === "undefined") {
  window.process = {
    env: {},
    on: function () {},
    off: function () {},
    emit: function () {},
    platform: "browser",
  };
} else if (typeof process.on !== "function") {
  process.on = function () {};
  process.off = function () {};
  process.emit = function () {};
}
