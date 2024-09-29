let data = []; //guardar preguntes i respostes que obtenim del server
let preguntaActual = 0; //establim un index per a la pregunta actual
let tempsRestant;
let temporitzador; //variable per a la resta de temps
let estatDeLaPartida = []; //guardar les respostes del usuari
;

/*
https://www.w3schools.com/jsref/prop_win_localstorage.asp
https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
https://es.javascript.info/localstorage
https://www.w3schools.com/jsref/prop_style_display.asp
*/

//Carreguem les preguntes
function carregarPreguntes() {
  fetch(`../back/migrate.php`, {
    method: "POST",
    body: JSON.stringify({ count: 30 }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((info) => {
    console.log(info);
    data = info; //guardem les preguntes i respostes
    iniciarTemporitzador(); //iniciem el temporitzador
    mostrarPreguntes(); //mostrem preguntes
  })
  .catch((error) => {
    console.error('Error al cargar las preguntas:', error);
  });
}
function iniciarTemporitzador() {
  tempsRestant = 30;
  temporitzador = setInterval(comptadorTemps, 1000);
}

//Comptador de temps
function comptadorTemps() {
  if (tempsRestant > 0) {
    tempsRestant--; //comptador regressiu
    actualizarMarcador(); //actualitzacio del marcador
  } else {
    clearInterval(temporitzador); //aturar el comptador
    alert("Temps esgotat"); //avis de que el temps ha acabat
    enviarRespostes(); //enviar les respostes al servidor
  }
}
function actualizarMarcador() {
  const estat = document.getElementById("estatPartida");
  estat.innerHTML = `<h3>Temps restant: ${tempsRestant}s <br> Pregunta: ${
    preguntaActual + 1
  }/${data.length}</h3>`;
}

function mostrarPreguntes() {
  const punt = document.getElementById("partida");

  if (preguntaActual < data.length) {
    //Verifiquem si queden preguntes per mostrar
    const pregunta = data[preguntaActual]; //obtenim la pregunta actual del array
    let htmlString = `<h2> ${pregunta.pregunta} </h2> `; //creem una cadena per a mostrar la pregunta

    //iterem sobre les respostes de la pregnta actual
    for (let i = 0; i < pregunta.respostes.length; i++) {
      htmlString += `<button class="botoResposta" preg="${pregunta.id}" resp="${i}"> ${pregunta.respostes[i].resposta} </button>`;
    }
    punt.innerHTML = htmlString; //Actualitzem el div amb les respostes
  }
}
//Creem un event listener al div de partida per a gestionar els clics en els botons de resposta
document.getElementById("partida").addEventListener("click", botonsRespostes);

function botonsRespostes(e) {
  //Verifiquem si l'element clicat es un boto de resposta
  if (e.target.classList.contains("botoResposta")) {
    const indexPreg = e.target.getAttribute("preg"); //obtenim l'id de la pregunta
    const indexRes = e.target.getAttribute("resp"); //obtenim l'id de la resposta
    guardarRespostes(indexPreg, indexRes); //guardem la resposta
  }
}

function guardarRespostes(iPreg, iRes) {
  //Guardem la resposta del usuari
  estatDeLaPartida[preguntaActual] = {
    pregunta: iPreg,
    resposta: iRes,
  };

  //Si hi ha més preguntes, mostrem la seguent
  if (preguntaActual < data.length - 1) {
    preguntaActual++;
    mostrarPreguntes();
    actualizarMarcador();
  } else {
    enviarRespostes(); //si no queden mes preguntes enviem les respostes
  }
}
function enviarRespostes() {
  fetch(`../back/finalitzaBBDD.php`, {
    method: "POST",
    body: JSON.stringify(estatDeLaPartida),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((info) => {
      mostrarResultat(info);
    });
}

function mostrarResultat(info) {
  const punt = document.getElementById("resultat");
  punt.innerHTML = `<h2>Respostes Correctes: ${info.correcte}</h2>
          <h2>Total Respostes: ${info.totalResp}</h2>`;
}

carregarPreguntes();
