process.on("uncaughtException", (err) => {
  require("fs").writeFileSync("electron-error.log", err.stack);
  process.exit(1);
});
("use strict");

const { app, BrowserWindow } = require("electron");
const express = require("express");
const path = require("path");
const http = require("http");

let mainWindow;
let server;

function startServer(callback) {
  const expressApp = express();
  const distPath = path.join(__dirname, "dist");

  expressApp.use(express.static(distPath));

  expressApp.use(function (req, res) {
    res.sendFile(path.join(distPath, "index.html"));
  });

  server = http.createServer(expressApp);
  server.listen(3000, "127.0.0.1", function () {
    console.log("Server started on port 3000");
    callback();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Shop Manager",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.loadURL("http://127.0.0.1:3000");
  mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", function () {
    mainWindow.show();
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", function () {
  startServer(function () {
    createWindow();
  });
});

app.on("window-all-closed", function () {
  if (server) {
    server.close();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
