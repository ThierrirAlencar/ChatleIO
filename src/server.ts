import fastify from "fastify";
import { createServer } from "http";
import { Server } from 'socket.io';
import { prisma } from "./lib/prisma";
import path, { dirname } from "path";
import staticPlugin from '@fastify/static';
import { fileURLToPath } from "url";
import { readFile } from "fs";
 



const app = fastify();
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

interface readMessageEmitInterface{
    Content:string,
    UserName:string
}

//main event (everyone will use this to connect with us)
io.on("connection",async(socket)=>{
    console.log("New client connected!");

    socket.on("readMessage",async(message)=>{
        console.log("client emit: readMessage")
        
        const messageList = await prisma.message.findMany();
        const psP:readMessageEmitInterface[] = [];
       
        for(let i =0;i<messageList.length;i++){
            const e = messageList[i];
            const user = await prisma.user.findUnique({
                where:{
                    Id:e.u_id
                }
            })
            if(user){
                const ps:readMessageEmitInterface = {
                    Content:e.Content,
                    UserName:user.Name
                }
                psP.push(ps)
            }
        }
        console.log("server emit: recieveContent")
        io.emit("recieveContent",psP)
    })

    socket.on("message",async(message,id)=>{
        console.log("client emit: message")

        await prisma.message.create({
            data:{
                Content:message,
                u_id:id
            }
        })
        //recarregar a lista inteira
        console.log("server emit: recieveContent")
        const messageList = await prisma.message.findMany();
        const psP:readMessageEmitInterface[] = [];
       
        for(let i =0;i<messageList.length;i++){
            const e = messageList[i];
            const user = await prisma.user.findUnique({
                where:{
                    Id:e.u_id
                }
            })
            if(user){
                const ps:readMessageEmitInterface = {
                    Content:e.Content,
                    UserName:user.Name
                }
                psP.push(ps)
            }
        }
        io.emit("recieveContent",psP)
    })
    socket.on("CheckId",async(Id:number)=>{
        const doesTheUserExists = await prisma.user.findUnique({
            where:{
                Id
            }
        })
        if(doesTheUserExists){
            io.emit("checkIdExists",true)
        }else{
            io.emit("checkIdExists",false)
        }
    })

    socket.on("auth",async(UserName:string,Email:string,Password:string)=>{
        console.log("Auth called")
        const checkIfUserExists = await prisma.user.findUnique({
            where:{
                Email
            }
        })
        if(checkIfUserExists){
            console.log("logged-in")
            io.emit("Logged",checkIfUserExists.Id)
            
        }else{
            console.log("signed-in")
            const created = await prisma.user.create({
                data:{
                    Email,Name:UserName,Password:Password
                }
            })
            io.emit("Logged",created.Id)
        }
    })
})

// Add static file serving
app.register(staticPlugin, {
  root: path.join(process.cwd(),"public"),
  prefix: '/public/', // optional
})


// Modify the GET route
app.get("/", async (req, res) => {
    console.log("get / called")
    return res.sendFile('index.html');
})


const port = 5647
const host = "127.0.0.1"
server.listen(port,host,()=>{
    console.log("server running at:http://"+host+":"+port)
})