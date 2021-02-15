//import * as http from 'http';
//import * as WebSocket from 'ws';

//const WebSocket = require('ws');
const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const WebSocket = require('ws')

global.client = "undefined";

//const wss = new WebSocket.Server({ port: 8080 })
//const wss = new WebSocket.Server({ server })

// Body parser
//app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json());

function waitForElement(){
    if(global.client !== "undefined"){
        global.client.send(message + '\r\n\r\nblocked-uri: ' + blockedUri);
    }
    else{
        setTimeout(waitForElement, 250);
    }
}


app.get("/", (req,res) => {
  res.setHeader("Content-Security-Policy", "frame-src https://bit.ly; report-uri /report");
  res.sendFile('views/index.html', {root: __dirname })
});

app.use(bodyParser.json({ type: 'application/csp-report' }));

app.post("/report", (req,res) => {
  blockedUri = req.body['csp-report']['blocked-uri'];

  console.log('blocked-uri: ' + blockedUri);
  if (blockedUri.includes('mysecret')) {
     message = 'CSP violation report leaked the full redirect path.';
  }else if (blockedUri.includes('example.com')){
     message = 'CSP violation report leaked the redirect domain.';
  }else if (blockedUri.includes('bit.ly')){
     message = 'CSP violation report did not leak any redirect data.';
  }else{
     message = 'Unexpected data in the CSP violation report.'
  }

  waitForElement();

  //global.client.send(message + '\r\n\r\nblocked-uri: ' + blockedUri);
  return res.send('CSP violation report received');
});

//app.use(express.urlencoded({ extended: true }));

// Listen on port 5000
var server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const wss = new WebSocket.Server({ server });

//const WebSocket = require('ws')
 
//const wss = new WebSocket.Server({ port: 8080 })
//const wss = new WebSocket.Server({ server })
wss.on('connection', ws => {
  console.log('Client connected');
  global.client = ws;
  ws.on('message', message => {
  //  console.log(`Received message => ${message}`)
    if (message == 'Message received'){
      console.log('message received!');
      ws.close();
      global.client = "undefined";
    }
    
  })
  //ws.send('Hello!');
})
