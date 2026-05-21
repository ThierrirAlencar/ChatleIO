import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";



export async function getPage(req:FastifyRequest, res:FastifyReply){
    try{
        console.log("get / called")
        res.status(200).sendFile('index.html');
    }catch(err){
        console.error(err);
        res.status(500).send({error:"An error occurred while fetching the page"});
    }
}
