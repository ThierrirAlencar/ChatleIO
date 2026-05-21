
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import { readMessageEmitInterface } from '../types/interface/readMessageEmitInterface';




export async function registerSocketIOEvents(io:Server,prisma:PrismaClient){
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

}