var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;


function Cad(){
    this.logs;

    this.conectar=function(){
        let cad=this;
        mongo.connect("mongodb+srv://patata:patata@cluster0.sziburb.mongodb.net/?retryWrites=true&w=majority",{ useUnifiedTopology: true },function(err,database){
            if(!err){
                database.db("Procesos22").collection("logs",function(err,col){
                    if (err){
                        console.log("No se puede obtener la coleccion")
                    }
                    else{       
                        console.log("Tenemos la colección logs");                                 
                        cad.logs=col;                                                  
                    }
                });
            }else{
                console.log("No se pudo conectar con MongoDB");
                 
            }
        });
    }

    //Logs
    this.insertarLog=function(registroLog,callback){
        insertar(this.logs,registroLog,callback);
    }
    
    function insertar(coleccion,elemento,callback){ 
        coleccion.insertOne(elemento,function(err,result){
            if(err){
                console.log("error");
            }
            else{
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }
//Inicio de sesion --
//fin de sesión --
//crear partida --
//unir a partida --
//abandonar partida --
//finalizar partida 

    //Select
    this.obtenerLogs=function(callback){
    	obtenerTodos(this.logs,callback);
    }

    function obtenerTodos(coleccion,callback){
        coleccion.find().toArray(function(error,col){
            callback(col);
        });
    };

    this.obtenerUsuarios=function(callback){
        obtenerTodos(this.usuarios,callback);
    }

    this.obtenerOCrearUsuario=function(criterio,callback){
        obtenerOCrear(this.usuarios,criterio,callback)
    }

    function obtenerOCrear(coleccion,criterio,callback)
    {
        coleccion.findOneAndUpdate(criterio, {$set: criterio}, {upsert: true}, function(err,doc) {
           if (err) { throw err; }
           else { 
                console.log("Updated"); 
                callback(doc);
            }
         });  
    }
    



    //this.conectar();
}

module.exports.Cad=Cad