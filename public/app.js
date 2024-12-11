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

if(localStorage.getItem("Id")){

}else{
    const userName = prompt("Informe seu userName")
    socket.emit("auth",userName)
    socket.on("Logged",(id)=>{
        localStorage.setItem("Id",id)
    })
}




//send in search of a message
socket.emit("readMessage")

socket.on("recieveContent",(data)=>{
    const messageSpace = document.querySelector(".card__content");
    const deleteList = messageSpace.querySelectorAll("p")

    deleteList.forEach((e)=>{
        document.removeChild(e)
    })
    console.log(data)
    data.forEach(element => {

        const eDiv = document.createElement("p");
        eDiv.innerHTML = `${element.UserName} :   ${element.Content}`
        messageSpace.appendChild(eDiv)
    });
})

document.querySelector("button").addEventListener("click",()=>{
    const content = document.querySelector("input").value
    //refers to wich part we want to use
    socket.emit("message",content,Number(localStorage.getItem("Id")))
})