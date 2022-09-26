
//CREACIÓN DEL JUEGO
function Juego(){
    this.partidas={}; //Diccionario (asociación clave-valor) this.partidas=[];
    this.usuarios={}; //array asociativo

    this.agregarUsuario=function(nick){
        if (!this.usuarios[nick]){
            this.usuarios[nick]=new Usuario(nick,this);
        }
    }

    this.eliminarUsuario=function(nick){
        delete this.usuarios[nick];
    }

    this.crearPartida=function(nick){
        //obtener código único
        //crear la partida con propietario nick
        //devolver el código
        let codigo=Date.now();
        this.partidas[codigo]=new Partida(codigo, nick);
        return codigo;
    }

    this.unirseAPartida=function(codigo,nick){
        if(this.partidas[codigo]){
            this.partidas[codigo].agregarJugador(nick);
        }
        else{
            console.log("La partida no existe")
        }
    }

    this.obtenerPartidas=function(){
        let lista;
        
        for(let key in this.partidas){ //for(i=0;i++;i<this.partidas.lenght;)
            lista.push({codigo:key, owner:this.partidas[codigo].owner})
        }
        return lista;
    }

    this.obtenerPartidasDisponibles=function(){
        //devolver sólo las partidas sin completar
    }

    
}

//CREACIÓN DE UN USUARIO
function Usuario(nick,juego){
    this.nick=nick;
    this.juego=juego;  //Usuario conoce la clase Juego

    this.crearPartida=function(){
        return this.juego.crearPartida(this.nick)
    }

    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo, this.nick)

    }

}


//CREACIÓN DE LA PARTIDA
function Partida(codigo, nick){
    this.codigo=codigo;
    this.owner=nick;
    this.jugadores=[];
    this.fase="inicial"; //new Inicial()

    this.agregarJugador=function(nick){
        if (this.jugadores.length<2){
            this.jugadores.push(nick);
        }
    }

    this.agregarJugador=function(nick){
        
    }

}