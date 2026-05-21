import { FastifyInstance } from "fastify";
import { getRoom } from "./routes/getRoom";
import { id } from "zod/locales";

export async function roomsRouter(app:FastifyInstance,options:any){
    app.route({method:"GET",url:"/rooms/:id",handler:getRoom,schema:{
        params:{
            id:{type:"number",description:"ID of the room to fetch",example:1}
        }
    }})
}