function ServidorWS(){
    //enviar peticiones

    //gestionar peticiones
    this.lanzarServidorWS=function(io,juego){
        io.on('conection', (socket) => {
            console.log('Usuario conectado');
        });
    }

}

module.exports.ServidorWS=ServidorWS;