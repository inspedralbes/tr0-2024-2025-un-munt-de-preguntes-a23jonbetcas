let data = []; // guardar preguntes i respostes que obtenim del server 
let preguntaActual = 0; // establim un index per a la pregunta actual
let tempsRestant = 30; // 10 segons per defecte
let temporitzador; // variable per a la resta de temps
let tempsAcabat = false;

let estatDeLaPartida = {
    id: 0,
    feta: false,
    preguntesResposes: 1,
};

// Carreguem les preguntes
function carregarPreguntes() {
    fetch('http://localhost/tr0-2024-2025-un-munt-de-preguntes-a23jonbetcas/back/getPreguntes.php', {
        method: "POST",
        body: JSON.stringify({ count: 10 }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(info => {
        console.log(info);
        data = info;
        iniciarTemporitzador();
        mostrarPreguntes();        
    });
}

/* FUNCIONS DEL CRONO*/
function iniciarTemporitzador() {
    temporitzador = setInterval(comptadorTemps, 1000);
}
//Comptador de temps
function comptadorTemps() {
    if (tempsRestant > 0) {
        tempsRestant--; //comptador regressiu
        actualizarMarcador(); //actualitzacio del marcador i temps
    } else {
        tempsAcabat = true;
        clearInterval(temporitzador); //aturem el temp
        alert("Temps esgotat");
        finalitzarPartida(); //acabem el joc
    }
}

function actualizarMarcador() {
    const estat = document.getElementById("estatPartida");
    estat.innerHTML = `<h3>Temps: ${tempsRestant}s <br> Pregunta: ${estatDeLaPartida.preguntesResposes}/10</h3>`;
}

/* FUNCIONS DE LA PARTIDA */
function mostrarPreguntes() {
    const punt = document.getElementById("partida");
    let htmlString = ''; // Inicialitzem una cadena HTML buida

    if (preguntaActual < data.length) {
        const pregunta = data[preguntaActual];
        htmlString += '<h2>' + pregunta.pregunta + '</h2>';

        // Utilitzem un bucle for molt bàsic per afegir les respostes com botons
        for (let i = 0; i < pregunta.respostes.length; i++) {
            htmlString += `<button pregunta="${preguntaActual}" resposta="${i}" onclick="comprovarResposta(${preguntaActual}, ${i})">
            ${pregunta.respostes[i].resposta} 
         </button>`;
  }
        punt.innerHTML = htmlString; //Actualitzem el div amb les respostes
    }
}


function comprovarResposta(iPreg, iRes) {

    if (tempsAcabat) {
        alert("Temps esgotat!");
        return;
    }

    const pregunta = data[iPreg];
    //accedim a la resposta correcta de la pregunta actual i si es correcte o no, executara l'alert amb correcte o incorrecte
    alert(pregunta.respostes[iRes].correcta ? "Correcte" : "Incorrecte");

    preguntaActual++; //Passem a la seguent
    estatDeLaPartida.preguntesResposes = preguntaActual + 1; //Actualitzar marcador de preguntes

    //Si segueixen quedant preguntes les segueix mostrant, sino finalitza la partida
    preguntaActual < data.length ? mostrarPreguntes() : finalitzarPartida();

}
function finalitzarPartida() {
    const estatCrono = document.getElementById("estatPartida");
    estatCrono.innerHTML += '<p>Test finalitzat!</p>';
    clearInterval(temporitzador);
}

// Iniciar el joc
carregarPreguntes();
