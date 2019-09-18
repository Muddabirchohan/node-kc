
const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var request = require('request');

// var kc = Keycloak('/keycloak.json'); 

// console.log("hello",kc);

// const expressHbs = require('express-handlebars');

const app = express();


var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });
// console.log(keycloak.checkSso()())

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








    // app.get('/apis/me', keycloak.enforcer('user:profile', {response_mode: 'token'}), function (req, res) {
    //     var token = req.kauth.grant.access_token.content;
    //     var permissions = token.authorization ? token.authorization.permissions : undefined;
    //     // show user profile
    // });


app.post( '/protect', keycloak.checkSso(),function(req,res){

console.log(req.headers.authorization)

console.log();
res.send("hello")

if(req.headers.authorization === req.req.kauth.grant.access_token.signed){
  console.log("token matched",req.req.kauth.grant.access_token.content)
}

else{
console.log("token didnt match")
}


//   if (req.headers.authorization) {
//     const options = {
//       method: 'GET',
//       url: `http://localhost:8080/auth/realms/Node-Realm/.well-known/openid-configuration`,
//       headers: {
//         token: req.headers.authorization,
//       },
//     };
// console.log(options)
//     // send a request to the userinfo endpoint on keycloak
//     request(options, (error, response, body) => {
//       if (error) throw new Error(error);

//       // if the request status isn't "OK", the token is invalid
//       if (response.statusCode !== 200) {
//         res.status(401).json({
//           error: `unauthorized`,
//         });
//       }
//       // the token is valid pass request onto your next function
//       else {
//          console.log("response from req")  
//       }
//     });
//   } else {
//     // there is no token, don't process request further
//     res.status(401).json({
//     error: `unauthorized`,
//   });
//   }
});


// app.get( '/checksso', keycloak.checkSso(), (req,res)=>{
// if(keycloak.checkSso(res)){
//   console.log(res)
// }
// else{
//   console.log("nun")
// }
// } );



// app.get( '/check-sso', keycloak.checkSso(), function(res,req){
//   console.log(req.req.kauth.grant.access_token.signed);
//   const content = req.req.kauth.grant.access_token.content;
//   if(content){
//   console.log("token matched",content.preferred_username,content.email,content.given_name)
//   }
// } );




app.use( keycloak.middleware( { logout: '/logoff' } ));
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