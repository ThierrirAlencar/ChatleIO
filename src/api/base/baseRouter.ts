import { FastifyInstance } from "fastify";
import { getPage } from "./routes/getPage";

export async function baseRouter(app:FastifyInstance){   
    app.route({method:"GET",url:"/app",handler:getPage,schema:{
    
    }})
}