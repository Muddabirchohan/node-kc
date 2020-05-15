var express = require("express");
var app = express.Router();
var { keycloak } = require("./../kcconfig");

app.post("/service/token", function (req, res) {
  res.send({ data: "send" });
});
app.get("/service/public", function (req, res) {
  res.json({ message: "public" });
});
app.get("/service/secured", keycloak.protect(), function (req, res) {
  res.json({ message: "secured" });
});
app.get("/service/admin", keycloak.protect("user:admin"), function (req, res) {
  res.json({ message: "admin" });
});

module.exports = app;
