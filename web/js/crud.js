preguntaActual = 0;
let data = []; // guardar preguntes i respostes que obtenim del server

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
      data = info; // guardem les preguntes i respostes
      mostrarPreguntes(); // mostrem preguntes
    })
    .catch((error) => {
      console.error("Error al cargar las preguntas:", error);
    });
}

function mostrarPreguntes() {
  const punt = document.getElementById("crud");
  let htmlString =
    "<table border='1'><tr><th>Pregunta</th><th>Imatges</th><th>Respostes</th><th>Editar</th><th>Eliminar</th></tr>";

  for (let i = 0; i < data.length; i++) {
    let pregunta = data[i];
    htmlString += `<tr>
              <td>${pregunta.pregunta}</td>
              <td><img src="${pregunta.imatge}" width="200" height="200"/></td>
              <td><ul>`;
    for (let j = 0; j < pregunta.respostes.length; j++) {
      htmlString += `<li>${pregunta.respostes[j].resposta}</li>`;
    }
    htmlString += `</ul></td>`;
    htmlString +=
      "<td><button onclick='editarPreguntes()'>Editar</button></td>";
    htmlString +=
      "<td><button onclick='eliminarPreguntes()'>Eliminar</button></td>";
    htmlString += "</tr>";
  }
  htmlString += "</table>";
  punt.innerHTML = htmlString;
}

function afegirPreguntes() {
    document.getElementById("insertar").addEventListener("submit", function (event) {
        event.preventDefault();
  
        const dadesForm = new FormData(this);
        const pregunta = {};
  
        dadesForm.forEach((value, key) => {
            if (key === "Correcta") {
                pregunta.correcta = value; //Guardem la pregunta correcta
            } else {
                pregunta[key] = value; //Guardem les altres preguntes
            }
        });  
        //Enviem les respostes com un array
        pregunta.respostes = [
          { resposta: pregunta["Resposta 1"] },
          { resposta: pregunta["Resposta 2"] },
          { resposta: pregunta["Resposta 3"] },
          { resposta: pregunta["Resposta 4"] }
        ];  
        //Guardem la correcta
        const correctaIndex = pregunta.correcta;
        pregunta.correcta = pregunta[`Resposta ${correctaIndex}`];
  
        console.log("Pregunta:", pregunta);

        fetch(`../back/afegir.php`, {
          method: "POST",
          body: JSON.stringify(pregunta),
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
            carregarPreguntes();
          })
          .catch((error) => {
            console.error("Error al enviar las preguntas:", error);
          });
      });
  }
  
  
carregarPreguntes();
afegirPreguntes();
