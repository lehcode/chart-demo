var express = require("express");
var serveStatic = require("serve-static");
var path = require("path");

var app = express();

app.use(
  serveStatic(path.resolve("./dist"), {
    index: ["index.html"]
  })
);

console.log("Starting HTTP server");

app.listen({
  port: 8080,
  host: "127.0.0.1"
});
