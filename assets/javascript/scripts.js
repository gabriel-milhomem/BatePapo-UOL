var mensagens = [];
var participantes = ["Joao", "Maria", "Fernando"];
var fundoLateral = document.querySelector(".fundoLateral");

enviarParticipante();

function enviarMensagem() {
    var listaPaiMensagens = document.querySelector("#listaMensagem");
    var entrada = document.querySelector(".caixaTexto");
    mensagens.push(entrada.value);
    listaPaiMensagens.innerHTML = "";
    entrada.value = "";
    for(var i = 0; i < mensagens.length; i++) {
        renderizarMensagem(mensagens[i], listaPaiMensagens);
    }
}

function renderizarMensagem(mensagem, ul) {
    var liNovo = document.createElement("li");
    liNovo.classList.add("mensagem");
    liNovo.innerHTML = " <p> <time> (09:22:38) </time> <span> <strong> João </strong> para <strong> Maria: </strong> </span> " + mensagem + "</p>";
    ul.appendChild(liNovo);
    scrollarParaBaixo();
}

function enviarParticipante() {
    var listaPaiParticipantes = document.querySelector("#listaParticipante");
    listaPaiParticipantes.innerHTML = "";
    for(var i = 0; i < participantes.length; i++) {
        renderizarParticipante(participantes[i], listaPaiParticipantes);
    }
}

function renderizarParticipante(nome, ul) {
    var liNovo = document.createElement("li");
    liNovo.classList.add("participante");
    liNovo.innerHTML = " <div> <ion-icon name= 'person-circle'> </ion-icon> <span> " + nome + " </span> </div> <ion-icon class= 'verificado' name= 'checkmark-sharp'> </ion-icon>";
    ul.appendChild(liNovo);
}

function scrollarParaBaixo() {
    var chatMensagem = document.querySelector("main");
    chatMensagem.scrollTop = chatMensagem.scrollHeight - chatMensagem.clientHeight;
}

function temBarraLateral(existeBarra) {
    var menuLateral = document.querySelector("aside");
    if(!existeBarra) {
        fundoLateral.style.display = "block";
        setTimeout(esperarFundoLateral, 300);
        menuLateral.classList.toggle("asideNaTela");
    }

    else {
        fundoLateral.classList.toggle("fundoPretoLateral");
        menuLateral.classList.toggle("asideNaTela");
        fundoLateral.style.display = "none";
    }

}

function esperarFundoLateral() {
    fundoLateral.classList.toggle("fundoPretoLateral");
}