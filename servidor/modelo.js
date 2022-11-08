
/////////////////////////////////////////////////////////////////////////
//CREACIÓN DEL JUEGO
/////////////////////////////////////////////////////////////////////////
/**
 * @function Juego
 */
 function Juego() {
    this.partidas = {}; //Diccionario (asociación clave-valor) this.partidas=[];
    this.usuarios = {};

    /**
     * Agrega un usuario si no existe previamente.
     * @param {String} nick Nombre del usuario
     * @returns {JsonWebKey} Registro del usuario 
     */
    this.agregarUsuario = function (nick) {
        let res = { "nick": -1 };
        if (!this.usuarios[nick]) {
            this.usuarios[nick] = new Usuario(nick, this);
            res = { "nick": nick };
            console.log("Nuevo usuario: " + nick);
        }
        return res;
    }

    /**
     * Elimina al usuario de la lista de usuarios actual
     * @param {String} nick Nombre del usuario
     */
    this.eliminarUsuario = function (nick) {
        delete this.usuarios[nick];
    }

    /**
     * Se elimina al usuario de la partida actual
     * @param {String} nick Nombre del usuario
     */
    this.usuarioSale = function (nick) {
        if (this.usuarios[nick]) {
            this.finalizarPartida(nick);
            this.eliminarUsuario(nick);
        }
    }

    /**
     * Un jugador crea una partida
     * @param {String} nick Nombre del usuario
     * @returns {JsonWebKey} Codigo de la partida
     */
    this.jugadorCreaPartida = function (nick) {
        let usr = this.usuarios[nick]; //Juego.obtenerUsuario(nick)
        let res = { codigo: -1 };

        if (usr) {
            let codigo = usr.crearPartida();
            //let codigo = this.crearPartida(usr);
            res = { codigo: codigo };
        }
        return res;
    }


    /**
     * Crea una partida y genera el código de la misma
     * @param {String} usr Nombre del usuario
     * @returns {int} Codigo de la partida
     */
    this.crearPartida = function (usr) {
        //obtener código único
        //crear la partida con propietario nick
        //devolver el código
        let codigo = Date.now();
        console.log("Usuario " + usr.nick + " crea partida " + codigo);
        this.partidas[codigo] = new Partida(codigo, usr);
        return codigo;
    }

    /**
     * Añade un usuario a la partida con el mismo código de partida
     * @param {int} codigo Codigo de la partida
     * @param {String} usr Nombre del usuario
     * @returns {object} Union a partida
     */
    this.unirAPartida = function (codigo, usr) {
        let res = -1;
        if (this.partidas[codigo]) {
            res = this.partidas[codigo].agregarJugador(usr);
        }
        else {
            console.log("La partida no existe");
        }
        return res;
    }

    /**
     * Une al jugador a la partida
     * @param {String} nick Nombre del usuario
     * @param {int} codigo Codigo de la partida
     * @returns {JsonWebKey} Usuario que se une a la partida
     */
    this.jugadorSeUneAPartida = function (nick, codigo) {
        let usr = this.usuarios[nick];
        let res = { "codigo": -1 };

        if (usr) {
            let valor = usr.unirAPartida(codigo);
            //let valor = this.unirseAPartida(codigo,usr);
            res = { "codigo": valor };
        }
        return res;
    }

    /**
     * Obtiene el nombre de usuario de la lista
     * @param {String} nick Nombre del usuario
     * @returns {String} Nombre del usuario
     */
    this.obtenerUsuario = function (nick) {
        if (this.usuarios[nick]) {
            return this.usuarios[nick];
        }
    }

    /**
     * Devuelve la lista de las partidas
     * @returns {array} Lista de partidas
     */
    this.obtenerPartidas = function () {
        let lista;

        for (let key in this.partidas) { //for(i=0;i++;i<this.partidas.lenght;)
            lista.push({ "codigo": key, "owner": this.partidas[codigo].owner })
        }
        return lista;
    }

    /**
     * Devuelve la lista de las partidas disponibles (partidas no completadas)
     * @returns {array} Lista de partidas
     */
    this.obtenerPartidasDisponibles = function () {
        let lista = [];
        for (let key in this.partidas) {
            if (this.partidas[key].fase == "inicial") {
                lista.push({ "codigo": key, "owner": this.partidas[key].owner.nick });
            }
        }
        return lista;
    }

    /**
     * Cambia el estado de la partida a 'final'
     * @param {String} nick Nombre del usuario 
     */
    this.finalizarPartida = function (nick) {
        for (let key in this.partidas) {
            if (this.partidas[key].fase == "inicial" && this.partidas[key].estoy(nick)) {
                this.partidas[key].fase = "final";
            }
        }
    }

    /**
     * Obtiene la partida al pasarle un codigo
     * @param {int} codigo Codigo de la partida
     * @returns {object} Partida
     */
    this.obtenerPartida = function (codigo) {
        return this.partidas[codigo];
    }


}


/////////////////////////////////////////////////////////////////////////
//CREACIÓN DE UN USUARIO
/////////////////////////////////////////////////////////////////////////
/**@function Usuario */
function Usuario(nick, juego) {
    this.nick = nick;
    this.juego = juego;  //Usuario conoce la clase Juego
    this.tableroPropio;
    this.tableroRival;
    this.partida;
    this.flota = [];

    /**
     * Llama al metodo crearPartida de Juego
     * @returns {object} Juego 
     */
    this.crearPartida = function () {
        return this.juego.crearPartida(this);
    }

    /**
     * Llama al metodo unirAPartida de juego
     * @param {int} codigo Codigo partida
     */
    this.unirAPartida = function (codigo) {
        this.juego.unirAPartida(codigo, this);

    }

    /**
     * Inicializa los tableros
     * @param {ing} dim Tamaño del tablero (x*x)
     */
    this.inicializarTableros = function (dim) {
        this.tableroPropio = new Tablero(dim);
        this.tableroRival = new Tablero(dim);
    }

    /**
     * Inicializa los barcos de la partida.
     */
    this.inicializarFlota = function () {
        //this.flota.push(new Barco("b2",2));
        // this.flota.push(new Barco("b4",4));
        this.flota["b2"] = new Barco("b2", 2);
        this.flota["b4"] = new Barco("b4", 4);
        //otros barcos ...
    }

    /**
     * Coloca el barco en las posición indicada teniendo en cuenta su tamaño.
     * Las posiciones del barco pueden ser fijas o predefinidas, aleatorias, creadas por el usuario...
     */
    this.colocarBarco = function (nombre, x, y) {
        if (partida.fase == "desplegando") {
            let barco = this.flota[nombre];
            this.tableroPropio.colocarBarco(barco, x, y);

        };
    }

    /**
     * Comprueba que los barcos se han colocado
     * @returns {boolean} Colocacion barcos
     */
    this.todosDesplegados = function () {
        for (var key in this.flota) {
            if (!this.flota[key].desplegado) {
                return false;
            }
        }
        return true;
    }

    /**
     * Llama al metodo barcosDesplegados de partida
     */
    this.barcosDesplegados = function () {
        this.partida.barcosDesplegados();
    }

    /**
     * Llama al metodo disparar de partida
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     */
    this.disparar = function (x, y) {
        this.partida.disparar(this.nick, x, y);
    }

    /**
     * Llama al metodo meDisparan de partida
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     */
    this.meDisparan = function (x, y) {
        this.tableroPropio.meDisparan(x, y);
    }

    /**
     * Devuelve el estado del jugador
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     * @returns {string} Estado
     */
    this.obtenerEstado = function (x, y) {
        return this.tableroPropio.obtenerEstado(x, y);
    }

    /**
     * Marca el estado en el tablero riaval. Si el estado es "agua",
     * pasa el turno al rival.
     * @param {string} estado 
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     */
    this.marcarEstado = function (estado, x, y) {
        this.tableroRival.marcarEstado(estado, x, y);
        if (estado == "agua") {
            this.partida.cambiarTurno(this.nick);
        }
    }

    this.flotaHundida = function () {
        for (var key in this.flota) {
            if (this.flota[key].estado != "hundido") {
                return false;
            }
        }
        return true;
    }

}

/////////////////////////////////////////////////////////////////////////
//CREACIÓN DE LA PARTIDA
////////////////////////////////////////////////////////////////////////
/**@function Partida */
function Partida(codigo, usr) {
    this.codigo = codigo;
    this.owner = usr;
    this.jugadores = [];
    this.fase = "inicial"; //new Inicial()
    this.maxJugadores = 2;
    this.turno;

    /**
     * Agrega al usuario si hay hueco en la partida.
     * @param {String} usr Nombre del usuario
     * @returns {JSON} Codigo de la partida
     */
    this.agregarJugador = function (usr) { //this.puedeAgregar.Jugador
        let res = this.codigo;
        if (this.hayHueco()) {
            this.jugadores.push(usr);
            console.log(usr.nick + " se ha unido a la partida");
            usr.partida = this;
            usr.inicializarTableros(5);
            usr.inicializarFlota();
            this.comprobarFase();
        }
        else {
            res = -1;
            console.log("La partida esta completa");
        }
        return res;
    }

    /**
     * Comprueba la fase de la partida. Si estan todos los jugadores permitidos,
     * cambia a la fase "desplegando".
     */
    this.comprobarFase = function () {
        if (!this.hayHueco()) {
            this.fase = "desplegando";
        }
    }

    /**
     * Devuelve true si quedan huecos disponibles.
     * @returns {boolean} Quedan huecos
     */
    this.hayHueco = function () {
        return (this.jugadores.length < this.maxJugadores);
    }

    /**
     * Comprueba si existe el jugador.
     * @param {String} nick Nombre del usuario
     * @returns {boolean} Jugador existe
     */
    this.estoy = function (nick) {
        for (i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nick == nick) {
                return true;
            }
        }
        return false;
    }

    /**
     * Comprueba la fase jugando.
     * @returns {String} Fase de la partida
     */
    this.esJugando = function () {
        return this.fase == "jugando";
    }

    this.esDesplegando = function () {
        return this.fase == "desplegando";
    }

    this.esFinal = function () {
        return this.fase == "final";
    }

    /**
     * Comprueba que todos los barcos han sido colocados.
     * @returns {boolean} Barcos colocados
     */
    this.flotasDesplegadas = function () {
        for (i = 0; i < this.jugadores.length; i++) {
            if (!this.jugadores[i].todosDesplegados()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Comprueba si lso barcos han sido desplegados.
     * Si lo están, cambiara la fase a "jugando".
     */
    this.barcosDesplegados = function () {
        if (this.flotasDesplegadas()) {
            this.fase = "jugando";
            this.asignarTurnoInicial();
        }
    }

    /**
     * Asigna el turno inicial al primer jugador de la lista
     */
    this.asignarTurnoInicial = function () {
        this.turno = this.jugadores[0];
    }

    /**
     * Cambia el turno al otro jugador
     * @param {String} nick Nombre del usuario
     */
    this.cambiarTurno = function (nick) {
        this.turno = this.obtenerRival(nick);
    }

    /**
     * Obtiene el nombre del jugador coincide con el parametro de entrada.
     * @param {String} nick Nombre del usuario
     * @returns {String} Nombre del usuario
     */
    this.obtenerJugador = function (nick) {
        let jugador;
        for (i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nick == nick) {
                return this.jugadores[i];
            }
        }
        return jugador;
    }

    /**
     * Obtiene el nombre del otro jugador que no coincide con el parametro de entrada.
     * @param {String} nick Nombre del usuario
     * @returns {String} Nombre del rival
     */
    this.obtenerRival = function (nick) {
        let rival;
        for (i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nick != nick) {
                return this.jugadores[i];
            }
        }
        return rival;
    }

    /**
     * Comprueba quien en el atacante y realiza el ataque.
     * @param {Striq} nick Nombre del usuario
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     */
    this.disparar = function (nick, x, y) {
        let atacante = this.obtenerJugador(nick);
        console.log("Atacante: " + atacante.nick);
        if (this.turno.nick == atacante.nick) {
            let atacado = this.obtenerRival(nick);
            console.log("Atacado: " + atacado.nick);
            atacado.meDisparan(x, y);
            let estado = atacado.obtenerEstado(x, y);
            console.log("Estado: " + estado)
            atacante.marcarEstado(estado, x, y);
            this.comprobarFin(atacado);
        }
        else {
            console.log("No es tu turno");
        }
    }

    /**
     * Comprueba si se ha cumplido la condición de victoria.
     * @param {String} jugador Nombre del usuario
     */
    this.comprobarFin = function (jugador) {
        if (jugador.flotaHundida()) {
            this.fase = "final";
            console.log("Fin de la partida");
            console.log("Ganador: " + this.turno.nick);
        }
    }

    /**
     * Agrega al creador de la partida a la partida.
     */
    this.agregarJugador(this.owner);


    function Inicial() {
        this.nombre = "inicial";
    }

    function Desplegando() {
        this.nombre = "desplegando";
    }

    function Jugando() {
        this.nombre = "jugando";
    }

    function Final() {
        this.nombre = "final";
    }
}
/////////////////////////////////////////////////////////////////////////
//TABLERO
/////////////////////////////////////////////////////////////////////////
/**
 * @function Tablero
 * @param {int} size Tamaño del tablero
 */
function Tablero(size) {
    this.size = size; //filas = columnas
    this.casillas;

    /**
     * Crea el tablero inicial de la partida.
     * @param {int} tam Tamaño del tablero
     */
    this.crearTablero = function (tam) {
        this.casillas = new Array(tam);
        for (x = 0; x < tam; x++) {
            this.casillas[x] = new Array(tam);
            for (y = 0; y < tam; y++) {
                this.casillas[x][y] = new Casilla(x, y);
            }
        }
    }

    /**
     * Coloca el barco en el tablero y lo marca como desplegado
     * @param {object} barco Barco
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     */
    this.colocarBarco = function (barco, x, y) {
        if (this.casillasLibres(x, y, barco.tam)) {
            for (i = x; i < barco.tam; i++) {
                this.casillas[i][y].contiene = barco;
            }
            barco.desplegado = true;
        }
    }

    /**
     * Comprueba las casillas donde hay barcos.
    * @param {int} x Posicion x
    * @param {int} y Posicion y
     * @returns {boolean} Casilla libre
     */
    this.casillasLibres = function (x, y, tam) {
        for (i = x; i < tam; i++) {
            let contiene = this.casillas[i][y].contiene;
            if (!contiene.esAgua()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Le pasa la posición de la casilla en la acción de disparo.
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     */
    this.meDisparan = function (x, y) {
        this.casillas[x][y].contiene.meDisparan();
    }

    /**
     * Obtiene el estado de la casilla.
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     * @returns {String} Estado de la casilla
     */
    this.obtenerEstado = function (x, y) {
        return this.casillas[x][y].contiene.obtenerEstado();
    }

    /**
     * Cambia el estado de la casilla.
     * @param {String} estado Estado de la casilla
     * @param {int} x Posicion x
     * @param {int} y Posicion y
     */
    this.marcarEstado = function (estado, x, y) {
        this.casillas[x][y].contiene = estado;
    }

    /**
     * Crea el tablero.
     */
    this.crearTablero(size);

}

/////////////////////////////////////////////////////////////////////////
//CASILLA
/////////////////////////////////////////////////////////////////////////
/**
 * @function Casilla
 * @param {int} x Posicion x
 * @param {int} y Posicion y
 */
function Casilla(x, y) {
    this.x = x;
    this.y = y;
    this.contiene = new Agua();
}

/////////////////////////////////////////////////////////////////////////
//BARCO
/////////////////////////////////////////////////////////////////////////
/**
 * @function Barco
 * @param {String} nombre Nombre del barco
 * @param {int} tam Tamaño del barco
 */
function Barco(nombre, tam) {
    this.nombre = nombre;
    this.tam = tam
    this.orientacion; //horizontal, vertical, .... (se asume horizontales)
    this.desplegado = false;
    this.estado = "intacto";
    this.disparos = 0;

    /**
     * Cambia la casilla de agua a false.
     * @returns {boolean} Casilla de agua
     */
    this.esAgua = function () {
        return false;
    }

    /**
     * Comprueba si el barco a sido atacado o si ha sido hundido.
     */
    this.meDisparan = function () {
        this.disparos++;
        if (this.disparos < this.tam) {
            this.estado = "tocado";
            console.log("Tocado");
        } else {
            this.estado = "hundido";
            console.log("Hundido!!");
        }
    }

    /**
     * Devuelve el estado del barco.
     * @returns {string} Estado del barco
     */
    this.obtenerEstado = function () {
        return this.estado;
    }

}

/////////////////////////////////////////////////////////////////////////
//AGUA
/////////////////////////////////////////////////////////////////////////
/**
 * @function Agua
 */
function Agua() {
    this.nombre = "agua";

    /**
     * Pone la casilla de agua a true.
     * @returns {boolean} Casilla de agua
     */
    this.esAgua = function () {
        return true;
    }

    /**
     * Imprime "agua" (ha fallado el disparo).
     */
    this.meDisparan = function () {
        console.log("Agua")
    }

    /**
     * Pone el estado en "agua".
     */
    this.obtenerEstado = function () {
        return "agua";
    }
}

module.exports.Juego = Juego; //Super objeto