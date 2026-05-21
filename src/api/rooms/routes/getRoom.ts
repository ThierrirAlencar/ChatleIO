import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../../lib/prisma"
import z from "zod"


export async function getRoom(req:FastifyRequest,res:FastifyReply){
        const {id} = z.object({
            id:z.coerce.number().describe("ID of the room to fetch")
        }).parse(req.params)
        try{
            const room = await prisma.room.findUnique({
                where:{
                    Id:Number(id)
                }
            })
            if(!room){
                return res.status(404).send({error:"Room not found"})
            }
            return res.send(room)
        }catch(error){
            console.error("Error fetching room:",error)
            return res.status(500).send({error:"Internal server error"})
        }
}
