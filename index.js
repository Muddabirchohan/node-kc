var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var Keycloak = require("keycloak-connect");
var KcAdminClient = require("keycloak-admin").default;

var cors = require("cors");

var app = express();
app.use(bodyParser.json());

app.use(cors());

var memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

var keycloak = new Keycloak({
  store: memoryStore,
});

const kcAdminClient = new KcAdminClient(keycloak);

// Authorize with username / password
// kcAdminClient.auth({
//   username: "chohan",
//   password: "123",
//   grantType: "password",
//   clientId: "node-client",
// });

// kcAdminClient.setConfig({
//   realmName: "REALM001",
// });

// // List all users
// const users = kcAdminClient.users
//   .find()
//   .then((res) => console.log("res", res))
//   .catch((e) => console.log("errors", e));

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

app.get("/service/public", function (req, res) {
  res.json({ message: "public" });
});

app.get("/service/secured", keycloak.protect(), function (req, res) {
  res.json({ message: "secured" });
});

app.get("/service/admin", keycloak.protect("user:admin"), function (req, res) {
  res.json({ message: "admin" });
});

app.use("*", function (req, res) {
  res.send("Route Not found!");
});

app.listen(8000, function () {
  console.log("Started at port 8000");
});
