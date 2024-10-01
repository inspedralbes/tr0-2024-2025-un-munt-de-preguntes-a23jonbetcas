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
  let htmlString = "";
  htmlString += "<a href='index.html'>Tornar al quiz</a>";
  const punt = document.getElementById("crud");
  htmlString =
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
    htmlString += `<td><button onclick='editarPreguntes(${pregunta.id})'>Editar</button></td>`;
    htmlString += `<td><button onclick='eliminarPreguntes(${pregunta.id})'>Eliminar</button></td>`;
    htmlString += "</tr>";
  }
  htmlString += "</table>";
  punt.innerHTML = htmlString;
}

function afegirPreguntes() {
  document
    .getElementById("insertar")
    .addEventListener("submit", function (event) {
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
        { resposta: pregunta["Resposta 1"] },
        { resposta: pregunta["Resposta 2"] },
        { resposta: pregunta["Resposta 3"] },
        { resposta: pregunta["Resposta 4"] },
      ];

      const correctaIndex = pregunta.correcta;
      pregunta.correcta = pregunta[`Resposta ${correctaIndex}`];

      fetch(`../back/afegir.php`, {
        method: "POST",
        body: JSON.stringify(pregunta),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((info) => {
          console.log(info);
          carregarPreguntes();
        })
        .catch((error) => {
          console.error("Error al enviar las preguntas:", error);
        });
    });
}

function editarPreguntes(id) {
  console.log("ID EDITAT:", id);
  console.log("DATA:", data);

  let pregunta;
  const idBuscat = parseInt(id, 10);

  console.log("ID:", id, "Type of ID:", typeof id);
  console.log("ID Buscat:", idBuscat, "Type of ID Buscat:", typeof idBuscat);

  //primer busquem la pregunta
  for (let i = 0; i < data.length; i++) {
       
    if (data[i].id === idBuscat) {
      pregunta = data[i];
      console.log("Pregunta trobada:", pregunta);
      break;
    }
    console.log(`ID trobat ${pregunta} amb idBuscat ${idBuscat}`);
  }

  const formulari = document.getElementById("formEditar");
  formulari["pregunta"].value = pregunta.pregunta;
  formulari["Resposta 1"].value = pregunta.respostes[0].resposta;
  formulari["Resposta 2"].value = pregunta.respostes[1].resposta;
  formulari["Resposta 3"].value = pregunta.respostes[2].resposta;
  formulari["Resposta 4"].value = pregunta.respostes[3].resposta;
  formulari["Correcta"].value = pregunta.correcta;

  formulari.dataset.id = id; //guardem el id de la pregunta en el formulari

  formulari.onsubmit = function (event) {
    event.preventDefault();

    const novaPregunta = {
      id: formulari.dataset.id,
      pregunta: formulari["pregunta"].value,
      respostes: [
        { resposta: formulari["Resposta 1"].value },
        { resposta: formulari["Resposta 2"].value },
        { resposta: formulari["Resposta 3"].value },
        { resposta: formulari["Resposta 4"].value },
      ],
      correcta: formulari["Correcta"].value,
    };

    console.log(novaPregunta);
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
      console.log(info);
      carregarPreguntes();
    })
    .catch((error) => {
      console.error("Error al enviar las preguntas:", error);
    });
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
afegirPreguntes();
