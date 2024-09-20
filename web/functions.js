let data = [];
let preguntaActual = 0;

// Carreguem les preguntes
function carregarPreguntes() {
    fetch('data.json')
        .then(response => response.json())
        .then(info => {
            data = info;
            mostrarPreguntes();
        });
}

// Función para mostrar las preguntas (respetando el doble bucle for)
function mostrarPreguntes() {
    const punt = document.getElementById("partida");
    let htmlString = '';

    for (let i = preguntaActual; i < data.preguntes.length; i++) {
        htmlString += `<h2>${data.preguntes[i].pregunta}</h2>`;        
        for (let j = 0; j < data.preguntes[i].respostes.length; j++) {
            htmlString += `<button id="button-${i}-${j}" onclick="mostrar(${i}, ${j})">${data.preguntes[i].respostes[j].resposta}</button>`;
        }
        break;
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
    //actualitzem i passem a la seguent pregunta
    preguntaActual++;    
    mostrarPreguntes();
    actualitzarMarcador();
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
    preguntesResposes: 0,
};

// Iniciar el joc
carregarPreguntes();
