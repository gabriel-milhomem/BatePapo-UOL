var listaPaiMensagens;
var fundoLateral = document.querySelector(".fundoLateral");
var outroPrompt = 0;
var objetoNome;

entrouSite();
iniciarParticipante();
/*setInterval(iniciarChat, 3000);
setInterval(iniciarParticipante, 10000);
setInterval(estarPresente, 5000);*/

function entrouSite() {
    if (outroPrompt === 0) {
        var seuNome = prompt("Qual o seu nome: ");
    }
    else {
        var seuNome = prompt("Digite outro nome, pois este já está em uso: ")
    }
    objetoNome = {"name": seuNome};
    outroPrompt++;
    var reqEnviarNome = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants", objetoNome);
    reqEnviarNome.then(iniciarChat).catch(entrouSite);
}

function estarPresente() {
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/status", objetoNome);
}

function iniciarChat() {
    var reqMensagem = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages");
    reqMensagem.then(logicaIniciarChat);
}

function iniciarParticipante() {
    var reqParticipante = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants");
    reqParticipante.then(logicaIniciarParticipante);

}

function logicaIniciarParticipante(resposta) {
    var participantes = resposta.data;
    var listaPaiParticipantes = document.querySelector("#listaParticipante");
    listaPaiParticipantes.innerHTML = "";

    for(var i = 0; i < participantes.length; i++) {
        renderizarParticipante(participantes[i].name, listaPaiParticipantes);
    }
}

var tamanhoAnterior;
function logicaIniciarChat(resposta) {
    var mensagens = resposta.data;
    listaPaiMensagens = document.querySelector("#listaMensagem");
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

function enviarMensagem() {
    var entrada = document.querySelector(".caixaTexto");
    var objetoMensagem = {"from": objetoNome.name, "to": "todos", "text": entrada.value, "type": "message"};
    if(entrada.value === "") {
        return;
    }
    entrada.value = "";
    renderizarMensagem(objetoMensagem.text, listaPaiMensagens, "", objetoMensagem.from, objetoMensagem.to, true, objetoMensagem.type);
    var promessaMensagem = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/messages", objetoMensagem);
    promessaMensagem.catch(tratarErroMensagem);
}

function tratarErroMensagem() {
    window.location.reload();
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
    if (podeScrollar) {
        scrollarParaBaixo();
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