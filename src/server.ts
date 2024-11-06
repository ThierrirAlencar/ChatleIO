import WebScoket from "ws"

const port = 8080

//initialize a new WebSocket server
const server = new WebScoket.Server({port});


server.on('connection',(socket)=>{
    
    console.log(`server running at ${port}`)

    socket.on("message",(message)=>{
        socket.send(message)
    })
})
