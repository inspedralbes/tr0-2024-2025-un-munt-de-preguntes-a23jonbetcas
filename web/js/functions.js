let data = []; // guardar preguntes i respostes que obtenim del server 
let preguntaActual = 0; // establim un index per a la pregunta actual
let tempsRestant = 30; // 10 segons per defecte
let temporitzador; // variable per a la resta de temps
let tempsAcabat = false;

let estatDeLaPartida = [
    envResp = new Array()
];

function enviarPreguntes() {
    fetch(`../back/finalitza.php`,
        {
            method: "POST",
            body: JSON.stringify(estatDeLaPartida),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(info => {
            console.log(info);
            data = info;
        });
}

// Carreguem les preguntes
fetch(`../back/getPreguntes.php`, {
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
        temporitzador = setInterval(comptadorTemps, 1000);
        mostrarPreguntes();
    });

//Comptador de temps
function comptadorTemps() {
    if (tempsRestant > 0) {
        tempsRestant--; //comptador regressiu
        actualizarMarcador(); //actualitzacio del marcador i temps
    } else {
        tempsAcabat = true;
        alert("Temps esgotat");
        finalitzarPartida(); //acabem el joc
    }
}

function actualizarMarcador() {
    const estat = document.getElementById("estatPartida");
    estat.innerHTML = `<h3>Temps: ${tempsRestant}s <br> Pregunta: ${preguntaActual + 1}/${data.length}</h3>`;}


/* FUNCIONS DE LA PARTIDA */
function mostrarPreguntes() {
    const punt = document.getElementById("partida");
    let htmlString = ''; // Inicialitzem una cadena HTML buida
    let indexPreg = 0

    if (preguntaActual <= data.length) {
        const pregunta = data[preguntaActual];
        htmlString += `<h2> ${pregunta.pregunta} </h2>`;

        for (let i = 0; i < pregunta.respostes.length; i++) {
            htmlString += `<button class="botoResposta" preg="${pregunta.id}" resp="${i}">
            ${pregunta.respostes[i].resposta} 
         </button>`;
        }
        punt.innerHTML = htmlString; //Actualitzem el div amb les respostes
    }
    
}
document.getElementById("partida").addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("botoResposta")) {
        const indexRes = e.target.getAttribute("resp");
        const indexPreg = e.target.getAttribute("preg");
        guardarRespostes(indexPreg, indexRes);
        actualizarMarcador();
    }
});
function guardarRespostes(iPreg, iRes) {
    if (tempsAcabat) {
        alert("Temps esgotat!");
        return;
    }
    
    if (preguntaActual < data.length) {
        mostrarPreguntes();
        preguntaActual++;
    } else {
        finalitzarPartida();
    }
}

function finalitzarPartida() {
    const estatCrono = document.getElementById("estatPartida");
    estatCrono.innerHTML += '<p>Test finalitzat!</p>';
    clearInterval(temporitzador);
    document.getElementById("partida").removeEventListener("click", guardarRespostes);
}
