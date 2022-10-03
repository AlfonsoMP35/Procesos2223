
//CREACIÓN DEL JUEGO
function Juego(){
    this.partidas={}; //Diccionario (asociación clave-valor) this.partidas=[];
    this.usuarios={}; 

    this.agregarUsuario=function(nick){
        let res={nick:-1};
        if (!this.usuarios[nick]){
            this.usuarios[nick]=new Usuario(nick,this);
            res={nick:nick};
            console.log("Nuevo usuario: " +nick);
        }
        return res;
    }

    this.eliminarUsuario=function(nick){
        delete this.usuarios[nick];
    }

    this.jugadorCreaPartida=function(nick){
        let usr = this.usuarios[nick]; //Juego.obtenerUsuario(nick)
        let res = {"codigo":-1};
      
        if(usr){
          let codigo = usr.crearPartida();
          //let codigo = this.crearPartida(usr);
          res={codigo:codigo};         
        }
        return res;
    }

    this.crearPartida=function(usr){
        //obtener código único
        //crear la partida con propietario nick
        //devolver el código
        let codigo=Date.now();
        console.log("Usuario "+usr.nick+ " crea partida "+codigo);
        this.partidas[codigo]=new Partida(codigo, usr);
        return codigo;
    }

    this.unirseAPartida=function(codigo,usr){
        let res=-1;
        if(this.partidas[codigo]){
            res = this.partidas[codigo].agregarJugador(usr);
        }
        else{
            console.log("La partida no existe")
        }
        return res;
    }

    this.jugadorSeUneAPartida=function(nick,codigo){
        let usr = this.usuarios[nick];
        let res = {"codigo":-1};
      
        if(usr){
          let valor = usr.unirseAPartida(codigo);
          //let valor = this.unirseAPartida(codigo,usr);
          res={"codigo":valor};         
        }
        return res;
    }

    //Devuelve la lista de todas las partidas 
    this.obtenerPartidas=function(){
        let lista;
        
        for(let key in this.partidas){ //for(i=0;i++;i<this.partidas.lenght;)
            lista.push({"codigo":key, "owner":this.partidas[codigo].owner})
        }
        return lista;
    }

    //Devuelve la lista de partidas disponibles (Las partidas no están completas)
    this.obtenerPartidasDisponibles=function(){
        let lista;
        
        for(let key in this.partidas){ 
            if (this.partidas.jugadores.length < 2){
                lista.push({"codigo":key, "owner":this.partidas[codigo].owner});
            }
        }
        return lista;
    }

    
}

//CREACIÓN DE UN USUARIO
function Usuario(nick,juego){
    this.nick=nick;
    this.juego=juego;  //Usuario conoce la clase Juego

    this.crearPartida=function(){
        return this.juego.crearPartida(this)
    }

    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo, this);

    }

}


//CREACIÓN DE LA PARTIDA
function Partida(codigo, usr){
    this.codigo=codigo;
    this.owner=usr;
    this.jugadores=[];
    this.fase="inicial"; //new Inicial()

    this.agregarJugador=function(usr){
        let res=this.codigo;
        if (this.jugadores.length<2){
            this.jugadores.push(usr);
            console.log(usr.nick + "se ha unido a la partida");
        }
        else {
            res=-1;
            console.log("La partida esta completa");
        }
        return res;
    }

    this.hayHueco=function(){
        return (this.jugadores.length<2);
    }

    
    this.agregarJugador(this.owner);

}

module.exports.Juego = Juego; //Super objeto