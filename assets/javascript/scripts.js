var inputLogin = document.querySelector("#inputLogin");
var listaPaiMensagens;
var fundoLateral = document.querySelector(".fundoLateral");
var objetoMensagem = {"from": undefined, "to": "Todos", "text": undefined, "type": "message"};
var objetoNome;
var ultimoClique;
var enviarPara = document.querySelector("#enviarPara");

function entrouSite() {
    teclaEnter();
    
    if(inputLogin.value === "") {
        return;
    }

    var seuNome = inputLogin.value;
    objetoNome = {"name": seuNome};
    var reqEnviarNome = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/participants", objetoNome);
    reqEnviarNome.then(carregarChat).catch(erroLogin);
}

function erroLogin() {
    var mensagemErro = document.querySelector(".erroServidor");
    mensagemErro.style.display = "block";
    inputLogin.value === "";
}

function estarPresente() {
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/uol/status", objetoNome);
}

function carregarChat() {
    var caixaLogin = document.querySelector("#caixaLogin");
    var imagemCarregando = document.createElement("img");
    var textoCarregando = document.createElement("p");
    imagemCarregando.setAttribute("src", "assets/imagens/carregando.png");
    caixaLogin.innerHTML = "";
    textoCarregando.innerText = "Entrando...";
    caixaLogin.appendChild(imagemCarregando);
    caixaLogin.appendChild(textoCarregando);
    setTimeout(transicaoDeTela, 1000);
}


function transicaoDeTela() {
    document.querySelector(".telaLogin").style.display = "none";
    document.querySelector("#interface").style.display = "block";
    iniciarParticipante();
    iniciarChat();
    setInterval(iniciarChat, 3000);
    setInterval(iniciarParticipante, 10000);
    setInterval(estarPresente, 5000);
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
    var temAnteriorIcone = false;
    
    listaPaiParticipantes.innerHTML = "";
    for(var i = 0; i < participantes.length; i++) {
        
        if(participantes[i].name === ultimoClique) {
            temAnteriorIcone = true;
            renderizarParticipante(participantes[i].name, listaPaiParticipantes, temAnteriorIcone);
        }
        renderizarParticipante(participantes[i].name, listaPaiParticipantes, false);
    }
    
    if(!temAnteriorIcone) {
        var todos = document.querySelector("#opcaoTodos .verifParticipante");
        todos.classList.add("verifAparecer");
        todos.classList.remove("verifSome");
        enviarPara.innerText = "Todos";
        objetoMensagem.to = "Todos";
    }
}

var listaServidorAnterior = null;
function logicaIniciarChat(resposta) {
    var mensagens = resposta.data;
    listaPaiMensagens = document.querySelector("#listaMensagem");
    var podeScrollar = true;
    listaPaiMensagens.innerHTML = "";

    if (listaServidorAnterior === mensagens[mensagens.length - 1].time) {
        podeScrollar = false;
    }

    for(var i = 0; i < mensagens.length; i++) {

        if(mensagens[i].to !== objetoNome.name && mensagens[i].to !== "todos" && mensagens[i].type === "private_message" && mensagens[i].from !== objetoNome.name) {
            continue;
        }

        renderizarMensagem(mensagens[i].text, listaPaiMensagens, mensagens[i].time, mensagens[i].from, mensagens[i].to, podeScrollar, mensagens[i].type);
    }

    listaServidorAnterior = mensagens[mensagens.length - 1].time;
}

function enviarMensagem() {
    var entrada = document.querySelector(".caixaTexto");
    objetoMensagem.from = objetoNome.name;
    objetoMensagem.text = entrada.value;
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
        textoDeEnvio = "reservadamente para";
    }

    liNovo.innerHTML = "<p> <time>" + tempo + "</time> <span> <strong>" + quemEnviou + "</strong> " + textoDeEnvio + " <strong>" + quemRecebeu + ": </strong> </span> " + mensagem + "</p>";
    ul.appendChild(liNovo);
    if (podeScrollar) {
        scrollarParaBaixo();
    }
}

function renderizarParticipante(nome, ul, setarIcone) {
    var liNovo = document.createElement("li");
    liNovo.classList.add("participante");
    liNovo.setAttribute("onclick", "escolherVerificado(this, true)");
    liNovo.innerHTML = " <div> <ion-icon name= 'person-circle'> </ion-icon> <span id= 'nomeParticipante'> " + nome + " </span> </div> <ion-icon class= 'verifParticipante verifSome' name= 'checkmark-sharp'> </ion-icon>";
    if(setarIcone) {
        var iconeSetar = liNovo.querySelector(".verifParticipante");
        iconeSetar.classList.remove("verifSome");
        iconeSetar.classList.add("verifAparece");
    }

    ul.appendChild(liNovo);
}

function escolherVerificado(escolhido, cliqueSecao) {
    
    if(cliqueSecao) {
        var iconeParticipante = escolhido.querySelectorAll("ion-icon")[1];
        var listaVerificado = document.querySelectorAll(".verifParticipante");
        

        ultimoClique = escolhido.querySelector("#nomeParticipante").innerText;

        for(var i = 0; i < listaVerificado.length; i++) {
            listaVerificado[i].classList.remove("verifAparece");
            listaVerificado[i].classList.add("verifSome");
        }

        iconeParticipante.classList.remove("verifSome");
        iconeParticipante.classList.add("verifAparece");


        if(listaVerificado[0].classList.contains("verifAparece")) {
            objetoMensagem.to = "Todos";
            enviarPara.innerText = "Todos";
        }

        else {
            var nomeParticipante = escolhido.querySelector("#nomeParticipante").innerText;
            objetoMensagem.to = nomeParticipante;
            enviarPara.innerText = nomeParticipante;
        }
    }

    else {
        var iconeVerificado = escolhido.querySelectorAll("ion-icon")[1];
        var listaVerificado = document.querySelectorAll(".verifVisibilidade");
        var tipoMensagem = document.querySelector("em");

        for(var i = 0; i < 2; i++) {
            listaVerificado[i].classList.remove("verifAparece");
            listaVerificado[i].classList.add("verifSome");
        }
        
        iconeVerificado.classList.remove("verifSome");
        iconeVerificado.classList.add("verifAparece");

        if(listaVerificado[0].classList.contains("verifAparece")) {
            objetoMensagem.type = "message";
            tipoMensagem.innerText = "(público)";
        }

        if(listaVerificado[1].classList.contains("verifAparece")) {
            objetoMensagem.type = "private_message";
            tipoMensagem.innerText = "(reservadamente)";
        }
    }
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


function teclaEnter() {
    var input = document.querySelector(".caixaTexto");
    input.addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
            if(input.value == "") {
                return;
            }
            document.querySelector("#botaoEnviar").click();
        }
    });

    inputLogin.addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
            if(inputLogin.value == "") {
                return;
            }
            document.querySelector("#enviarLogin").click();
        }
    });
}

function scrollarParaBaixo() {
    var chatMensagem = document.querySelector("main");
    chatMensagem.scrollTop = chatMensagem.scrollHeight;
}

function esperarFundoLateral() {
    fundoLateral.classList.toggle("fundoPretoLateral");
}

// Tentativa opcional 2;
// telaUsuario();
/*function telaUsuario() {
    if(window.innerWidth > 700) {
        document.querySelector("#mostrarParticipante").setAttribute("onclick", "temBarraLateral(null)");
        document.querySelector("#interface").style.width = "70vw";
        var telaLateral = document.querySelector("aside");
        telaLateral.classList.add("telaLateralDesktop");
    }
}*/