var listaMensagem = ["entra na sala..."];
var listaPai = document.querySelector("#listaMensagem");

function enviarMensagem() {
    var input = document.querySelector(".caixaTexto");
    listaMensagem.push(input.value);
    listaPai.innerHTML = "";
    input.value = "";
    for(var i = 0; i < listaMensagem.length; i++) {
        renderizarMensagem(listaMensagem[i]);
    }
}

function renderizarMensagem(mensagem) {
    var liNovo = document.createElement("li");
    liNovo.classList.add("mensagem");
    liNovo.innerHTML = " <p> <time> (09:22:38) </time> <span> <strong> João </strong> para <strong> Maria: </strong> </span> " + mensagem + "</p>";
    listaPai.appendChild(liNovo);
    scrollarParaBaixo();
}

function scrollarParaBaixo() {
    var chatMensagem = document.querySelector("main");
    chatMensagem.scrollTop = chatMensagem.scrollHeight;
}