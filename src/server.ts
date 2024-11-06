import fastify from "fastify";
import { createServer } from "http";
import { Server } from 'socket.io';
 
const app = fastify();
const server = createServer(app.server)

const io =  new Server(server,{
    cors:{
        origin:"*" //alow any url to access our api
    }
})

//main event (everyone will use this to connect with us)
io.on("connection",(socket)=>{
    console.log("New client connected!");

    socket.on("message",(message)=>{
        console.log("message event called")
        io.emit("message",`${socket.id.substr(0,2)} said ${message}`)
    })
})

//common backend
app.get("/",async(req,res)=>{
    res.send({
        message:"Bem vindo ao server de websocket"
    })
})


const port = 8080

server.listen(port,()=>{
    console.log("server running at:"+port)
})