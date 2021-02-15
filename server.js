//import * as http from 'http';
//import * as WebSocket from 'ws';

//const WebSocket = require('ws');
const express = require("express");
const app = express();
const http = require('http');

const port = process.env.PORT || 3000;

const WebSocket = require('ws')

var clients = [];

//const wss = new WebSocket.Server({ port: 8080 })
//const wss = new WebSocket.Server({ server })

// Body parser
app.use(express.urlencoded({ extended: false }));

app.get("/", (req,res) => {
  res.setHeader("Content-Security-Policy", "frame-src https://bit.ly; report-uri /report");
  res.sendFile('views/index.html', {root: __dirname })
});

app.post("/report", (req,res) => {
  console.log(req.body)
  //clients[0].send('CSP report: ' + req.body);
  return res.send('CSP violation report received');
});

// Listen on port 5000
var server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const wss = new WebSocket.Server({ server });

//const WebSocket = require('ws')
 
//const wss = new WebSocket.Server({ port: 8080 })
//const wss = new WebSocket.Server({ server })
wss.on('connection', ws => {
  clients.push(ws);
  //ws.on('message', message => {
  //  console.log(`Received message => ${message}`)
  //})
  clients[0].send('Hello! Message From Server!!');
})
