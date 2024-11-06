const socket = new WebSocket("ws://localhost:8080");

//listen for messages 
socket.onmessage = ({data})=>{
    console.log("message from the server", data)
}

//send a message
document.querySelector("button").addEventListener("click",()=>{
    socket.send("Hello World")
})