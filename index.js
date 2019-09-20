
// const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var request = require('request');
const KeyCloakCerts = require('get-keycloak-public-key');
const fetch = require('node-fetch');
const keycloak = require('./keycloak.json');
// const keyCloakCerts = new KeyCloakCerts(`http://localhost:8080/auth/realms/master/protocol/openid-connect/auth?`, 'React App');
//  console.log("hello",keyCloakCerts);
//  const publicKey = KeyCloakCerts.fetch(`http://localhost:8080/auth/realms/React%20App/protocol/openid-connect/certs/`)










const app = express();

var memoryStore = new session.MemoryStore();
// var keycloak = new Keycloak({ store: memoryStore });
// console.log(keycloak.checkSso()())
console.log(keycloak)

// let accessToken =  await keycloak.accessToken.get()
// console.log(accessToken)


app.use(cors())
app.use(cookieParser());

//session
app.use(session({
  secret: 'adasda',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// app.use(keycloak.middleware());

app.post('/token',(req,res)=>{
  console.log(req.headers.token);

})


app.get('http://localhost:8080/auth/realms/React%20App/protocol/openid-connect/certs',(req,res)=>{
  res.send(res);
  console.log(req,res);
})



app.listen(8000, function () {
  console.log('Listening at 8000');
})