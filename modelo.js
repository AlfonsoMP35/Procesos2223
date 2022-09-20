
//CREACIÓN DEL JUEGO
function Juego(){
    this.partidas={}; //Diccionario (asociación clave-valor) this.partidas=[];
    this.usuarios={}; //array asociativo

    this.agregarUsuario=function(nick){
        if (!this.usuarios[nick]){
            this.usuarios[nick]=new Usuario(nick,this);
        }
    }

    this.crearPartida=function(nick){
        //obtener código único
        //crear la partida con propietario nick
        //devolver el código
        console.log("partida creada");
    }

    
}

//CREACIÓN DE UN USUARIO
function Usuario(nick,juego){
    this.nick=nick;
    this.juego=juego;  //Usuario conoce la clase Juego

    this.crearPartida=function(){
        this.juego.crearPartida(this.nick)
    }

}


//CREACIÓN DE LA PARTIDA
function Partida(){
    this.codigo;


}