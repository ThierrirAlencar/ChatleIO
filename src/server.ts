import fastify from "fastify";
import { createServer } from "http";
import { Server } from 'socket.io';
import { prisma } from "./lib/prisma";
 
const app = fastify();
//transforma a instancia do fastify em um server .http

const server = createServer(app.server)

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
        console.log("read message called")
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

    socket.on("message",async(message,id)=>{
        console.log("message event called")
        
        await prisma.message.create({
            data:{
                Content:message,
                u_id:id
            }
        })
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