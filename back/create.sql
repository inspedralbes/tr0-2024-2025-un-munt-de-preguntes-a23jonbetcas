CREATE DATABASE muntPreguntes;

CREATE TABLE preguntes (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    pregunta TEXT NOT NULL,
    resposta1 TEXT NOT NULL,
    resposta2 TEXT NOT NULL,
    resposta3 TEXT NOT NULL,
    resposta4 TEXT NOT NULL,
    correcta INT(1) NOT NULL
);
