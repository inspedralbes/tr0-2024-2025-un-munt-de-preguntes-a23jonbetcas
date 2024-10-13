preguntaActual = 0;
let data = []; //guardar preguntes i respostes que obtenim del server

function carregarPreguntes() {
  fetch(`../back/getPreguntesAdmin.php`, {
    method: "POST",
    body: JSON.stringify({}),
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
      localStorage.setItem('preguntes',JSON.stringify(data));
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
  htmlString += `<button id = "botoafegir" onclick='afegirPreguntes()'>Afegir Pregunta</button>`;
  htmlString +=
    "<table border='1'><tr><th>ID</th><th>Pregunta</th><th>Imatges</th><th>Respostes</th><th>Editar</th><th>Eliminar</th></tr>";

  //iterem sobre les preguntes en la variable data
  for (let i = 0; i < data.length; i++) {
    //obtenim la pregunta actual
    let pregunta = data[i];
    htmlString += `<tr>
              <td>${pregunta.id}</td>
              <td>${pregunta.pregunta}</td>
              <td><img src="${pregunta.imatge}" width="200" height="200"/></td>
              <td><ul>`;
    //iterem sobre les respostes de la pregunta
    for (let j = 0; j < pregunta.respostes.length; j++) {
      htmlString += `<li>${pregunta.respostes[j].resposta}</li>`;
    }
    //mostrem els botons de editar i eliminar (haurien de ser event listeners)
    htmlString += `</ul></td>`;
    htmlString += `<td><button id="botoeditar" onclick='editarPreguntes(${pregunta.id})'>Editar</button></td>`;
    htmlString += `<td><button onclick='eliminarPreguntes(${pregunta.id})'>Eliminar</button></td>`;
    htmlString += "</tr>";
  }
  htmlString += "</table>";
  punt.innerHTML = htmlString;
}

function afegirPreguntes() {

  //ocultem el crud i mostrarem el insertar
  document.getElementById("crud").style.display = "none";
  document.getElementById("insertar").style.display = "block";

  //afegim un event listener al boto afegir per a enviar el form
  document.getElementById("insertar").addEventListener("submit", function (event) {
      event.preventDefault();

      //obtenim les dades del form
      const dadesForm = new FormData(this);
      const pregunta = {}; //inicialitzem un objecte buit per a emmagatzemar les dades de la pregunta


      //https://atomizedobjects.com/blog/javascript/how-to-get-the-javascript-foreach-key-value-pairs-from-an-object/
      
      /*Amb el dades form recorrem cada entrada del objecte formData, on key es el nom del camp del formulari,
      com per exemple pregunta o resposta tal, correcta, etc. Value es el valor ingresat.
      Si key del formulari es correcta, el seu valor es guarda a pregunta correcta. 
      Per a la resta de claus com pregunta, respostes i tal, el valor es guarda directament a l'objecte pregunta.
      Despres convertim les dades del formulari a un objecte pregunta esctucturat per a enviarlo
      */
      dadesForm.forEach((value, key) => {
        if (key === "Correcta") {
          pregunta.correcta = value; //guardem la resposta correcta
        } else {
          pregunta[key] = value; //guardem la resta de dades
        }
      });
      //Creem l'array de respostes 
      pregunta.respostes = [
        {id: 1,resposta: pregunta["Resposta 1"],correcta: pregunta.correcta === "1",},
        {id: 2,resposta: pregunta["Resposta 2"],correcta: pregunta.correcta === "2",},
        {id: 3,resposta: pregunta["Resposta 3"],correcta: pregunta.correcta === "3",},
        {id: 4,resposta: pregunta["Resposta 4"],correcta: pregunta.correcta === "4",},
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
          return response.text(); //obtenim la resposta com a text
        })
        .then((text) => {          
            const info = JSON.parse(text);
            console.log(info);
            document.getElementById("crud").style.display = "block";
            document.getElementById("insertar").style.display = "none";
            carregarPreguntes();         
        })
        .catch((error) => {
          console.error("Error al enviar las preguntas:", error);
        });
    });
}

function editarPreguntes(id) {
  console.log("DATA:", data);

  //ocultem el crud i mostrarem el editar
  document.getElementById("crud").style.display = "none";
  document.getElementById("formEditar").style.display = "block";

  const idBuscat = parseInt(id, 10);

  console.log("ID Buscat:", idBuscat);
  //configurem el click per al boto editar
    document.getElementById("edit").onclick = function () {
      //creem l'objecte que volem editar(pregunta)
    let novaPregunta = {
      id: idBuscat, //mantenim el mateix id
      pregunta: document.getElementById("pregunta").value,//obtenim el nou text de la pregunta
      imatge: document.getElementById("Imatge").value, //obtenim la nova imatge
      //i guardem lesn oves respostes amb la correcta
      respostes: [
        { id: 1, resposta: document.getElementById('rta1').value, correcta: document.getElementById('correcte').value === '1' },
        { id: 2, resposta: document.getElementById('rta2').value, correcta: document.getElementById('correcte').value === '2' },
        { id: 3, resposta: document.getElementById('rta3').value, correcta: document.getElementById('correcte').value === '3' },
        { id: 4, resposta: document.getElementById('rta4').value, correcta: document.getElementById('correcte').value === '4' }
      ]
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
      console.log(info); 
      carregarPreguntes();
    })
    .catch((error) => {
      console.error("Error al eliminar la pregunta:", error);
    });
}
carregarPreguntes();
