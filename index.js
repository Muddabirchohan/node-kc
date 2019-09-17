
const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var request = require('request');

var kc = Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'Node-Realm',
  clientId: 'React-Frontend'
}); 


// const expressHbs = require('express-handlebars');

const app = express();


var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });

app.use(cors())
app.use(cookieParser());

//session
app.use(session({
  secret:'thisShouldBeLongAndSecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());


//route protected with Keycloak
app.get('/start',(req,res)=>{
  res.send("hello");
})

app.get('/test', keycloak.protect(), (req, res)=>{
    console.log(memoryStore)
    // console.log(login)
    
  res.send({
    title:'protected route'
  });
});

// app.get('/testing',keycloak.enforcer('user:testuser'), (req, res)=>{
//      console.log("hello",keycloak.enforcer('testuser:manager')      )
    
//   res.send({
//     title:'checkSso'
//   });
// });

// app.get( '/manager', keycloak.protect( 'realm:manager' ),(req,res)=>{
//     res.send("user with manager role");
// } );


// app.get('/customLoginEnter', function (req, res) {
//   let rptToken = null
//   console.log(req.body);

//   keycloak.grantManager.obtainDirectly(req.query.login, req.query.password).then(grant => {
//       // keycloak.storeGrant(grant, req, res);
//       console.log(req);
//   }, error => {
//     console.log(req, res, rptToken, "Error: " + error);
//   });
// });

app.post( '/protect',(req,res)=>{

      // console.log("my token",req.headers.token );
     
// check each request for a valid bearer token
  // assumes bearer token is passed as an authorization header
  if (req.headers.token) {
    // configure the request to your keycloak server
    const options = {
      method: 'GET',
      url: `http://localhost:8080/auth/realms/Node-Realm/.well-known/openid-connection/userinfo`,
      headers: {
        // add the token you received to the userinfo request, sent to keycloak
        token: req.headers.token,
      },
    };
console.log("config",options)
    // send a request to the userinfo endpoint on keycloak
    request(options, (error, response, body) => {
      if (error) throw new Error(error);

      // if the request status isn't "OK", the token is invalid
      if (response.statusCode !== 200) {
        res.status(401).json({
          error: `unauthorized`,
        });
      }
      // the token is valid pass request onto your next function
      else {
         console.log("response from req")  
      }
    });
  } else {
    // there is no token, don't process request further
    res.status(401).json({
    error: `unauthorized`,
  });
  }
});

      // console.log(req);
      // res.send("hello")
// res.send(req.body)

      // res.setHeader('token', req.headers.token);
      // res.cookie("token", req.headers.token); 
      // res.json({
      //   auth: "authentication",
      //   token: req.headers.token
      // })
  // const data = JSON.stringify(req.headers.token)


// app.get('/getToken',(req,res)=>{
// res.send(req.cookies)
// })

// app.get('/api', keycloak.enforcer('user:profile', {response_mode: 'token'}), function (req, res) {
//   var token  = req.kauth.grant.access_token.content;
//   // var permissions = token.authorization ? token.authorization.permissions : undefined;
// console.log(token)
//   // show user profile
// });

// if (req.headers.authorization) {
//   // configure the request to your keycloak server
//   const options = {
//     method: 'GET',
//     url: `https://${keycloakHost}:${keycloakPort}/auth/realms/Node-Realm/protocol/openid-connect/userinfo`,
//     headers: {
//       // add the token you received to the userinfo request, sent to keycloak
//       Authorization: req.headers.authorization,
//     },
//   };

//   // send a request to the userinfo endpoint on keycloak
//   request(options, (error, response, body) => {
//     if (error) throw new Error(error);

//     // if the request status isn't "OK", the token is invalid
//     if (response.statusCode !== 200) {
//       res.status(401).json({
//         error: `unauthorized`,
//       });
//     }
//     // the token is valid pass request onto your next function
//     else {
//       next();
//     }
//   });
// } else {
//   // there is no token, don't process request further
//   res.status(401).json({
//   error: `unauthorized`,
// });


app.listen(8000, function () {
  console.log('Listening at 8000');
})