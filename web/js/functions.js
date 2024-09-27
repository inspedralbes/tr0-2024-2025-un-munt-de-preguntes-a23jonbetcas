let data = []; // guardar preguntes i respostes que obtenim del server 
let preguntaActual = 0; // establim un index per a la pregunta actual
let tempsRestant = 5; // 10 segons per defecte
let temporitzador; // variable per a la resta de temps
let tempsAcabat = false;

let estatDeLaPartida = [];


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
function rebreRespostes(info){
    let objeto = {
        totalRespostes: info.totalResp,
        respostesCorrectes: info.correcte,
    };
    mostrarResultat(objeto);    
}

function enviarPreguntes() {
    fetch(`../back/finalitza.php`, {
        method: "POST",
        body: JSON.stringify(estatDeLaPartida),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(info => {
        rebreRespostes(info);
    });
}

function mostrarResultat(objeto){
    const punt = document.getElementById("resultat");
    let htmlString = '';
    htmlString += `<h2> Total Respostes: ${objeto.totalRespostes} </h2>`;
    htmlString += `<h2> Respostes Correctes: ${objeto.respostesCorrectes} </h2>`;
    punt.innerHTML = htmlString;
}


//Comptador de temps
function comptadorTemps() {
    if (tempsRestant > 0) {
        tempsRestant--; //comptador regressiu
        actualizarMarcador(); //actualitzacio del marcador i temps
    } else {
        tempsAcabat = true;
        alert("Temps esgotat");
        clearInterval(temporitzador);
        document.getElementById("partida").removeEventListener("click", botonsRespostes);
        enviarPreguntes();
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
document.getElementById("partida").addEventListener("click", botonsRespostes);   

function botonsRespostes(e){    
        if (e.target.classList.contains("botoResposta")) {
            const indexRes = e.target.getAttribute("resp");
            const indexPreg = e.target.getAttribute("preg");
            guardarRespostes(indexPreg, indexRes);
        }
    }

function guardarRespostes(iPreg, iRes) {
    estatDeLaPartida[preguntaActual] = {
        pregunta: iPreg,
        resposta: iRes
    };

    if (preguntaActual < data.length - 1) {
        preguntaActual++;
        mostrarPreguntes();
        actualizarMarcador();
    } 
}

