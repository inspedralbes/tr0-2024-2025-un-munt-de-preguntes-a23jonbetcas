let data = [];
let preguntaActual = 0;

// Carreguem les preguntes
function carregarPreguntes() {
    fetch('http://localhost/tr0-2024-2025-un-munt-de-preguntes-a23jonbetcas/back/data.json')
        .then(response => response.json())
        .then(info => {
            data = info;
            mostrarPreguntes();
        });
}

// Función para mostr   ar las preguntas (respetando el doble bucle for)
function mostrarPreguntes() {
    const punt = document.getElementById("partida");
    let htmlString = '';

    if(preguntaActual<data.preguntes.length){
        htmlString += `<h2>${data.preguntes[preguntaActual].pregunta}</h2>`;        
        for (let j = 0; j < data.preguntes[preguntaActual].respostes.length; j++) {
            htmlString += `<button id="button-${preguntaActual}-${j}" onclick="mostrar(${preguntaActual}, ${j})">${data.preguntes[preguntaActual].respostes[j].resposta}</button>`;
        }
    }
    punt.innerHTML = htmlString;
}

//missatge que mostra si esta be o no
function mostrar(iPreg, iRes) {
    if (data.preguntes[iPreg].respostes[iRes].correcta) {
        alert("Correcte");
    } else {
        alert("Incorrecte");
    }

    const estat = document.getElementById("estatPartida");

    let htmlString = "";
    //actualitzem i passem a la seguent pregunta
    preguntaActual++;
    estatDeLaPartida.preguntesResposes = preguntaActual+1;
    //actualitzarMarcador();
    if(preguntaActual<data.preguntes.length){
    htmlString += '<br><h3 id=estatPartida > Pregunta: ' + estatDeLaPartida.preguntesResposes+ '/10 </h3>';
    }else{
        htmlString += '<p>Test finalitzat</p>';

    }
    mostrarPreguntes();
    estat.innerHTML=htmlString;
}

/*
Estat del joc
mostrar marcador, exemple: pregunta 4/10
[{idPreg,true o false,resp(1,2,3 o 4)},...,...]
array en funcio de les preguntes que s'han enviat(de moment 10)
*/
let estatDeLaPartida = {
    id: 0,
    feta: false,
    preguntesResposes: 1,
};

// Iniciar el joc
carregarPreguntes();
