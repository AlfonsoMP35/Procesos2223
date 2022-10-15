const fs=require("fs");
const express = require('express');
const app = express();
const modelo = require("./servidor/modelo.js");

const PORT = process.env.PORT || 3000; // Start the server

let juego = new modelo.Juego();


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

app.get("/agregarUsuario/:nick",function(request,response){
  let nick = request.params.nick;
  let res=juego.agregarUsuario(nick);
  response.send(res);
});

app.get("/crearPartida/:nick",function(request,response){
  let nick = request.params.nick;
  let res = juego.jugadorCreaPartida(nick);
  response.send(res); //Conecta con el clienteRes y res pasa a llamarse data en la otra clase
});

app.get("/unirseAPartida/:nick/:codigo",function(request,response){
  let nick = request.params.nick;
  let codigo = request.params.codigo;
  let res = juego.jugadorSeUneAPartida(nick,codigo);
  response.send(res);
});

app.get("/obtenerPartidas", function(request, response){
  let lista = juego.obtenerPartidas();
  response.send(lista);
});

app.get("/obtenerPartidasDisponibles", function(request, response){
  let lista = juego.obtenerPartidasDisponibles();
  response.send(lista);
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