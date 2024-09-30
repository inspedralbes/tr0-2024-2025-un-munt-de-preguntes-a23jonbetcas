CREATE TABLE preguntes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pregunta VARCHAR(255) NOT NULL,
    imatge VARCHAR (255) NOT NULL
);

CREATE TABLE respostes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pregunta_id INT,
    resposta VARCHAR(255) NOT NULL,
    FOREIGN KEY (pregunta_id) REFERENCES preguntes(id)
);
