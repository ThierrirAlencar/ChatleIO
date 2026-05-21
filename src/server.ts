import fastify from "fastify";
import { createServer } from "http";
import { Server } from 'socket.io';
import { prisma } from "./lib/prisma";
import path from "path";
import staticPlugin from '@fastify/static';
import { readFile } from "fs";
import { registerSocketIOEvents } from "./sockets/socketio";
import { API_HOST, API_PORT } from "./lib/env";
import cors from "fastify-cors";

const app = fastify();

//Registra configuração de cors
app.register(cors, {
  origin: "*"
});

//transforma a instancia do fastify em um server .http
const server = createServer((req, res) => {
  let filePath = "";

if (req.url === "/") {
    filePath = path.join(process.cwd(), "public", "index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
  } else if (req.url === "/app.js") {
    filePath = path.join(process.cwd(), "public", "app.js");
    res.writeHead(200, { "Content-Type": "application/javascript" });
  } else if (req.url?.endsWith(".css")) {
    filePath = path.join(process.cwd(), "public", req.url);
    res.writeHead(200, { "Content-Type": "text/css" });
  } else {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Erro interno do servidor");
    } else {
      res.end(data);
    }
  });
});

//cria um server socket.io a partir do server fastify 
const io =  new Server(server,{
    cors:{
        origin:"*" //alow any url to access our api
    }
})

// Add static file serving
app.register(staticPlugin, {
  root: path.join(process.cwd(),"public"),
  prefix: '/public/', // optional
}) 

const port = API_PORT || 5647
const host = API_HOST || "127.0.0.1"

server.listen(port,host,async()=>{
    await registerSocketIOEvents(io,prisma)
    console.log("server running at:http://"+host+":"+port)
})