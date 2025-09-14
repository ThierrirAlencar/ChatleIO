// Conectar ao servidor Socket.IO
const socket = io("http://localhost:5647");

// Tratamento de erros
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  alert("Falha ao conectar no servidor");
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
  alert("Ocorreu um erro de conexão");
});

// Função para login/cadastro
const LoginOrSingup = async () => {
  const userName = prompt("Informe seu nome (se não tiver feito login digite pela primeira vez)");
  const userEmail = prompt("Informe seu Email (se nunca tiver entrado digite pela primeira vez)");
  const userPassword = prompt("Informe sua senha (se não tiver, crie uma)");

  socket.emit("auth", userName, userEmail, userPassword);

  socket.once("Logged", (id) => {
    localStorage.setItem("Id", id);
  });
};

// Verificação de usuário já logado
if (localStorage.getItem("Id")) {
  socket.emit("CheckId", Number(localStorage.getItem("Id")));
  socket.once("checkIdExists", async (test) => {
    if (!test) {
      alert("Usuário não encontrado");
      await LoginOrSingup();
    }
  });
} else {
  LoginOrSingup();
}

// Pedir mensagens ao servidor
socket.emit("readMessage");

// Receber mensagens
socket.on("recieveContent", (data) => {
  const messageSpace = document.getElementById("messageSpace");

  // Limpar mensagens antigas
  messageSpace.innerHTML = "";

  // Adicionar mensagens recebidas
  data.forEach((element) => {
    const eDiv = document.createElement("p");
    eDiv.classList.add("mb-1"); // pequeno espaçamento entre mensagens
    eDiv.innerHTML = `<strong>${element.UserName}:</strong> ${element.Content}`;
    messageSpace.appendChild(eDiv);
  });

  // Scroll para a última mensagem
  messageSpace.scrollTop = messageSpace.scrollHeight;
});

// Enviar mensagens
document.getElementById("messageForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.getElementById("messageInput");
  const content = input.value.trim();

  if (content) {
    socket.emit("message", content, Number(localStorage.getItem("Id")));
    input.value = "";
  }
});
