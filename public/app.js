// const socket = new WebSocket("ws://localhost:8080");

// //listen for messages 
// socket.onmessage = ({data})=>{
//     console.log("message from the server", data)
// }

// //send a message
// document.querySelector("button").addEventListener("click",()=>{
//     socket.send("Hello World")
// })

const socket = io("ws://localhost:8080");

//listen to message event
socket.on("message",(text)=>{
    const el = document.createElement("p");
    el.innerHTML = text;
    document.querySelector(".messageSpace").appendChild(el);
})

document.querySelector("button").addEventListener("click",()=>{
    const content = document.querySelector("input").value
    //refers to wich part we want to use
    socket.emit("message",content)
})