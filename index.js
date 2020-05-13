// const Keycloak = require("keycloak-connect");
// const express = require("express");
// const session = require("express-session");
// var cors = require("cors");
// var cookieParser = require("cookie-parser");
// var request = require("request");
// const KeyCloakCerts = require("get-keycloak-public-key");
// const fetch = require("node-fetch");
// const kcConfig = require("./keycloak.json");
// // ​var memory = new session.MemoryStore();

// var keycloak = new Keycloak({ store: new session.MemoryStore() }, kcConfig);

// const app = express();

// // var keycloak = new Keycloak({ store: memoryStore });
// // let accessToken =  await keycloak.accessToken.get()
// // console.log(accessToken)

// app.use(
//   session({
//     secret: "some secret",
//     resave: false,
//     saveUninitialized: true,
//     store: new session.MemoryStore(),
//   })
// );
// app.use(keycloak.middleware());
// app.use(cors());
// app.use(cookieParser());

// // //session
// // app.use(
// //   session({
// //     secret: "adasda",
// //     resave: false,
// //     saveUninitialized: true,
// //     store: memoryStore,
// //   })
// // );

// app.get("/token", keycloak.protect(), (req, res) => {
//   console.log(req, res);
//   res.send("hello");
// });

// app.listen(8000, function () {
//   console.log("Listening at 8000");
// });

var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var Keycloak = require("keycloak-connect");
var cors = require("cors");

var app = express();
app.use(bodyParser.json());

// Enable CORS support
app.use(cors());

// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.

var memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Provide the session store to the Keycloak so that sessions
// can be invalidated from the Keycloak console callback.
//
// Additional configuration is read from keycloak.json file
// installed from the Keycloak web console.

var keycloak = new Keycloak({
  store: memoryStore,
});

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

app.get("/service/admin", keycloak.protect("realm:admin"), function (req, res) {
  res.json({ message: "admin" });
});

app.use("*", function (req, res) {
  res.send("Not found!");
});

app.listen(8000, function () {
  console.log("Started at port 8000");
});
