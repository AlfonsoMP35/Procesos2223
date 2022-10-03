const fs=require("fs");
const express = require('express');
const { Juego } = require("./cliente/modelo");
const app = express();

// Start the server
const PORT = process.env.PORT || 3000;


/*app.get('/', (req, res) => {
  res
    .status(200)
    .send("Hola")
    .end();
});*/

app.use(express.static(__dirname + "/"));

app.get("/", function(request,response){
	var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});



app.listen(PORT, () => {
  console.log('App está escuchando en el puerto ${PORT}');
  console.log('Ctrl+C para salir.');
});





/*
HTTP GET POST PUT DELETE

get "/"
get "/obtenerpartidas"
post "/agregarUsuario/:nick"
put "/actualizarPartida"
delete "/eliminarPartida"
...

get -> poca información
post -> mucha información
put-> actualización 
delete -> eliminar
*/