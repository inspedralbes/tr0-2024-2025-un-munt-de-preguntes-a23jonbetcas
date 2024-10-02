preguntaActual = 0;
let data = []; //guardar preguntes i respostes que obtenim del server

function carregarPreguntes() {
  fetch(`../back/getPreguntesBBDD.php`, {
    method: "POST",
    body: JSON.stringify({ count: 40 }),
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
      mostrarPreguntes();
    })
    .catch((error) => {
      console.error("Error al cargar las preguntas:", error);
    });
}

function mostrarPreguntes() {
  let htmlString = "";
  htmlString += "<a href='crud.html'>Tornar al CRUD</a>";
  const punt = document.getElementById("crud");
  htmlString = "";
  htmlString += `<button id = "botoafegir" onclick='afegirPreguntes()'>Afegir Pregunta</button>`
  htmlString +=
    "<table border='1'><tr><th>ID</th><th>Pregunta</th><th>Imatges</th><th>Respostes</th><th>Editar</th><th>Eliminar</th></tr>";

  for (let i = 0; i < data.length; i++) {
    let pregunta = data[i];
    htmlString += `<tr>
              <td>${pregunta.id}</td>
              <td>${pregunta.pregunta}</td>
              <td><img src="${pregunta.imatge}" width="200" height="200"/></td>
              <td><ul>`;
    for (let j = 0; j < pregunta.respostes.length; j++) {
      htmlString += `<li>${pregunta.respostes[j].resposta}</li>`;
    }
    htmlString += `</ul></td>`;
    htmlString += `<td><button id="botoeditar" onclick='editarPreguntes(${pregunta.id})'>Editar</button></td>`;
    htmlString += `<td><button onclick='eliminarPreguntes(${pregunta.id})'>Eliminar</button></td>`;
    htmlString += "</tr>";
  }
  htmlString += "</table>";
  punt.innerHTML = htmlString;
}

function afegirPreguntes() {

  document.getElementById("crud").style.display = "none";
  document.getElementById("insertar").style.display = "block";

  document.getElementById("insertar").addEventListener("submit", function (event) {
    event.preventDefault();

    const dadesForm = new FormData(this);
    const pregunta = {};

    dadesForm.forEach((value, key) => {
      if (key === "Correcta") {
        pregunta.correcta = value;
      } else {
        pregunta[key] = value;
      }
    });

    pregunta.respostes = [
      { id: 1, resposta: pregunta["Resposta 1"], correcta: pregunta.correcta === "1" },
      { id: 2, resposta: pregunta["Resposta 2"], correcta: pregunta.correcta === "2" },
      { id: 3, resposta: pregunta["Resposta 3"], correcta: pregunta.correcta === "3" },
      { id: 4, resposta: pregunta["Resposta 4"], correcta: pregunta.correcta === "4" },
    ];
    console.log(pregunta);

    fetch(`../back/afegir.php`, {
      method: "POST",
      body: JSON.stringify(pregunta),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        //Verifica el código de estado de la respuesta
        if (!response.ok) {
          throw new Error(`Error en la red: ${response.status}`);
        }
        return response.text(); //Obtén la respuesta como texto
      })
      .then((text) => {
        console.log("Respuesta del servidor:", text);
        try {
          const info = JSON.parse(text); //Intenta parsear el texto como JSON
          console.log(info);
          document.getElementById("crud").style.display = "block";
          document.getElementById("insertar").style.display = "none";
          carregarPreguntes();
        } catch (err) {
          console.error("Error al parsear la respuesta como JSON:", err);
        }
      })
      .catch((error) => {
        console.error("Error al enviar las preguntas:", error);
      });
  });
}

function editarPreguntes(id) {
  console.log("DATA:", data);

  document.getElementById("crud").style.display = "none";
  document.getElementById("formEditar").style.display = "block";

  const idBuscat = parseInt(id, 10);

  console.log("ID Buscat:", idBuscat);

  document.getElementById('edit').onclick = function() {
    let novaPregunta = {
      id: idBuscat,
      pregunta: document.getElementById('pregunta').value,
      imatge: document.getElementById('Imatge').value,
      rta1: document.getElementById('rta1').value,
      rta2: document.getElementById('rta2').value,
      rta3: document.getElementById('rta3').value,
      rta4: document.getElementById('rta4').value,
      correcte: document.getElementById('correcte').value,
    };

    fetch(`../back/actualitzar.php`, {
      method: "POST",
      body: JSON.stringify(novaPregunta),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((info) => {
        console.log("Respuesta del servidor:", info);
        carregarPreguntes();
        document.getElementById("crud").style.display = "block";
        document.getElementById("formEditar").style.display = "none";
      })
      .catch((error) => {
        console.error("Error al enviar las preguntas:", error);
      });
  };
}


function eliminarPreguntes(id) {
  fetch(`../back/eliminar.php`, {
    method: "POST",
    body: JSON.stringify({ id: id }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La resposta de la xarxa no ha estat correcta");
      }
      return response.json();
    })
    .then((info) => {
      console.log(info); // Ver información recibida
      carregarPreguntes(); // Recargar preguntas
    })
    .catch((error) => {
      console.error("Error al eliminar la pregunta:", error);
    });
}

carregarPreguntes();
