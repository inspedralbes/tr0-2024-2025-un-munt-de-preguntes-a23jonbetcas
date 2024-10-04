let data = []; //guardar preguntes i respostes que obtenim del server
let preguntaActual = 0; //establim un index per a la pregunta actual
let tempsRestant;
let temporitzador; //variable per a la resta de temps
let estatDeLaPartida = []; //guardar les respostes del usuari
let preguntesSeleccionades = 0;
/*
https://www.w3schools.com/jsref/prop_win_localstorage.asp
https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
https://es.javascript.info/localstorage
https://www.w3schools.com/jsref/prop_style_display.asp
*/

function iniciarPartida() {
  const portada = document.getElementById("portada");
  portada.innerHTML = `<h2>Benvingut al Quiz</h2><br><button id="iniciarPart">Iniciar Partida</button>`;

  document.getElementById("iniciarPart").addEventListener("click", mostrarFormulari);
}

function mostrarFormulari() {
  const portada = document.getElementById("portada");

  //Inicialitzem una cadena buida per a mostrar el formulari
  let htmlString = "";
  htmlString += `<h3>Nom del jugador: </h3><input id="nom"/>`;
  htmlString += `<h3>Numero de preguntes: </h3><input id="preg"/>`;
  htmlString += `<br><button id="botoJugador">Iniciar partida</button>`;

  //actualitzem el contingut del formulari
  portada.innerHTML = htmlString;
  document.getElementById("botoJugador").addEventListener("click", function () {
    const nom = document.getElementById("nom").value;
    const preg = document.getElementById("preg").value;

    if (nom == "" || preg == "") {
      alert("Tots els camps son obligatoris");
    } else {
      introduirDades(nom, preg);
    }
  });
}

function introduirDades(nom, preg) {

  //Guardem el nom del jugador i les preguntes en el localstorage
  localStorage.setItem("nom", nom);
  localStorage.setItem("preg", preg);
  preguntesSeleccionades = preg;

  document.getElementById("portada").style.display = "none";
  carregarPreguntes(preg);
  document.getElementById("estatPartida").style.display = "block";
  document.getElementById("partida").style.display = "block";
}

//Carreguem les preguntes
function carregarPreguntes(count) {
  fetch(`../back/getPreguntesBBDD.php`, {
    method: "POST",
    body: JSON.stringify({ count: count }),
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
    console.log(tempsRestant);
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
  estat.innerHTML = `<h3>Temps restant: ${tempsRestant}s <br> 
  Pregunta: ${preguntaActual + 1}/${preguntesSeleccionades}</h3>`;
}
function mostrarPreguntes() {
  const punt = document.getElementById("partida");

  //si encara no hem arribat al limit de preguntes
  if (preguntaActual < preguntesSeleccionades) {
    const pregunta = data[preguntaActual]; //obtenim la pregunta actual del array
    let htmlString = `<div"><h2>${pregunta.pregunta}</h2>`;
    if (pregunta.imatge) {
      htmlString += `<img src="${pregunta.imatge}" width="200" height="200"/>`;
    }

    //iterem sobre les respostes de la pregunta actual
    for (let i = 0; i < pregunta.respostes.length; i++) {
      //creem un boto per a cada resposta
      htmlString += `<button class="botoResposta" preg="${pregunta.id}" resp="${i}">${pregunta.respostes[i].resposta}</button>`;
    }
    htmlString += `</div>`;
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
    pregunta: iPreg, //guardem l'id de la pregunta
    resposta: iRes, //guardem l'id de la resposta seleccionada
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

  //inicialitzem una cadena buida
  let htmlString = "";
  const punt = document.getElementById("resultat");

  //Agreguem al HTML el numero de respostes correctes i total de respostes
  htmlString += `<h2>Respostes Correctes: ${info.correcte}</h2>`;
  htmlString += `<h2>Total Respostes: ${info.totalResp}</h2>`;

  document.getElementById("partida").style.display = "none";
  document.getElementById("estatPartida").style.display = "none";

  //Afegim el boto de tornar a l'inici que permet reiniciar el quiz
  htmlString += `<button id="ini">Tornar a l'inici</button>`;
  punt.innerHTML += htmlString; //insertem el contingut HTML generat en el div

  document.getElementById("ini").addEventListener("click", function () {
    console.log("Inici de la partida");
    //Reiniciem totes les variables per a tornar a jugar
    data = [];
    preguntaActual = 0;
    tempsRestant = 30;
    estatDeLaPartida = [];
    preguntesSeleccionades = 0;
    document.getElementById("resultat").innerHTML = ""; //netejem el resultat anterior 
    document.getElementById("portada").style.display = "block"; //mostrem la portada de nou
    iniciarPartida();
  });
}

iniciarPartida();
