var bodyParser = require("body-parser");
var { keycloak, memoryStore } = require("./kcconfig");
var express = require("express");
const app = express();
const middleware = require("./routes/middleware");
var session = require("express-session");
var cors = require("cors");

// var decoded = jwt.decode(token, secret, false);
// console.log("decoded", decoded);

app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

app.use("/middleware", middleware);

app.use("*", function (req, res) {
  res.send("Not found!");
});

app.listen(8000, function () {
  console.log("Started at port 8000");
});
