//entrada.value = "";
//var entrada = document.querySelector(".caixaTexto");
//mensagens.push(entrada.value);

var participantes = ["Joao", "Maria", "Fernando"];
var fundoLateral = document.querySelector(".fundoLateral");

entrouSite();
iniciarChat();
setInterval(iniciarChat, 3000);
enviarParticipante();

function entrouSite() {
    var seuNome = prompt("Qual o seu nome ? ");
    var objetoNome = {"name": seuNome};
    var requisicaoEnviarNome = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants", objetoNome);
}

function iniciarChat() {
    var requisicaoMensagem = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages");
    requisicaoMensagem.then(inicializarChat);
}

var tamanhoAnterior;
function inicializarChat(response) {
    var mensagens = response.data;
    var listaPaiMensagens = document.querySelector("#listaMensagem");
    var podeScrollar = false;
    listaPaiMensagens.innerHTML = "";

    if (tamanhoAnterior !== mensagens.length) {
        podeScrollar = true;
    }

    for(var i = 0; i < mensagens.length; i++) {
        if(mensagens[i].to !== "Milhominho" && mensagens[i].type === "private_message"){
            continue;
        }
        renderizarMensagem(mensagens[i].text, listaPaiMensagens, mensagens[i].time, mensagens[i].from, mensagens[i].to, podeScrollar, mensagens[i].type);
    }

    tamanhoAnterior = mensagens.length;
}

function renderizarMensagem(mensagem, ul, tempo, quemEnviou, quemRecebeu, podeScrollar, tipoMensagem) {
    var liNovo = document.createElement("li");
    var textoDeEnvio = "para";
    liNovo.classList.add("mensagem");

    if (tipoMensagem === "status") {
        liNovo.classList.add("mensagemSairEntrar");
        textoDeEnvio = "";
        quemRecebeu = "";
    }

    if (tipoMensagem === "private_message") {
        liNovo.classList.add("mensagemReservada");
        textoDeEnvio = "reservadamente para"
    }

    liNovo.innerHTML = "<p> <time>" + tempo + "</time> <span> <strong>" + quemEnviou + "</strong> " + textoDeEnvio + " <strong>" + quemRecebeu + ": </strong> </span> " + mensagem + "</p>";
    ul.appendChild(liNovo);
    if  (podeScrollar) {
        scrollarParaBaixo();
    }
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

function scrollarParaBaixo() {
    var chatMensagem = document.querySelector("main");
    chatMensagem.scrollTop = chatMensagem.scrollHeight;
}

function esperarFundoLateral() {
    fundoLateral.classList.toggle("fundoPretoLateral");
}