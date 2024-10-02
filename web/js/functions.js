let data = []; //guardar preguntes i respostes que obtenim del server
let preguntaActual = 0; //establim un index per a la pregunta actual
let tempsRestant;
let temporitzador; //variable per a la resta de temps
let estatDeLaPartida = []; //guardar les respostes del usuari
let preguntesSeleccionades = 10;
/*
https://www.w3schools.com/jsref/prop_win_localstorage.asp
https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
https://es.javascript.info/localstorage
https://www.w3schools.com/jsref/prop_style_display.asp
*/

function iniciarPartida() {
  const portada = document.getElementById("portada");
  portada.innerHTML += '<br><button id="iniciarPart">Iniciar Partida</button>';

    document.getElementById("iniciarPart").addEventListener("click", function () {
    document.getElementById("portada").style.display = "none";
    carregarPreguntes();
    document.getElementById("estatPartida").style.display = "block";
    document.getElementById("partida").style.display = "block";
  });
}
//Carreguem les preguntes
function carregarPreguntes() {
  fetch(`../back/getPreguntesBBDD.php`, {
    method: "POST",
    body: JSON.stringify({ count: preguntesSeleccionades }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((info) => {
      console.log(info);
      data = info; //guardem les preguntes i respostes
      iniciarTemporitzador(); //iniciem el temporitzador
      mostrarPreguntes(); //mostrem preguntes
      actualizarMarcador();
    })
    .catch((error) => {
      console.error("Error al cargar las preguntas:", error);
    });
}
function iniciarTemporitzador() {
  tempsRestant = 30;
  temporitzador = setInterval(comptadorTemps, 1000); //cada segon, executem la funcio comptadorTemps
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
  //mostrem el temps restant i la pregunta actual en el marcador
  estat.innerHTML = `<h3>Temps restant: ${tempsRestant}s <br> Pregunta: ${
    preguntaActual + 1
  }/${preguntesSeleccionades}</h3>`;
}
function mostrarPreguntes() {
  const punt = document.getElementById("partida");

  //si encara no hem arribat al limit de preguntes
  if (preguntaActual < preguntesSeleccionades) {
    const pregunta = data[preguntaActual]; //obtenim la pregunta actual del array
    let htmlString = `<h2> ${pregunta.pregunta} </h2> `; //creem una cadena per a mostrar la pregunta
    if (pregunta.imatge) {
      htmlString += `<img src="${pregunta.imatge}" width="200" height="200"/>`;
    }

    //iterem sobre les respostes de la pregunta actual
    for (let i = 0; i < pregunta.respostes.length; i++) {
      //creem un boto per a cada resposta
      htmlString += `<button class="botoResposta" preg="${pregunta.id}" resp="${i}"> ${pregunta.respostes[i].resposta} </button>`;
    }
    htmlString += "<br><br>";
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
    pregunta: parseInt(iPreg), //guardem l'id de la pregunta
    resposta: parseInt(iRes), //guardem l'id de la resposta seleccionada
  };

  //Si encara hi ha més preguntes
  if (preguntaActual < preguntesSeleccionades - 1) {
    //pasem a la seguent i actualitzem pantalla
    preguntaActual++;
    mostrarPreguntes();
    actualizarMarcador();
  } else {
    //si no queden preguntes aturem el temporitzador i enviem les respostes
    clearInterval(temporitzador);
    enviarRespostes();
  }
}
function enviarRespostes() {
  console.log("Respuestas enviadas:", JSON.stringify(estatDeLaPartida)); //Verifiquem les dades que s'envien
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
    })
    .catch((error) => {
      console.error("Error al enviar les respostes:", error);
    });
}

function mostrarResultat(info) {
  const punt = document.getElementById("resultat");
  //mostrem el numero de respostes correctes i el total de respostes que hem rebut
  punt.innerHTML = `<h2>Respostes Correctes: ${info.correcte}</h2><h2>Total Respostes: ${info.totalResp}</h2>`;
  punt.innerHTML+=`<button id="tornar">Tornar a la portada</button>`;

  document.getElementById("tornar").onclick = function () {
    location.reload();
  };

  const botoRespostes = document.querySelectorAll(".botoResposta");
  botoRespostes.forEach((boto) => {
    boto.disabled = true; //Deshabilitar cada botó de resposta

  });
}

iniciarPartida();
