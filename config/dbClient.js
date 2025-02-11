import "dotenv/config"
import mongoose from "mongoose";

class dbClient{
    constructor(){
            this.conect();
        }
    
        async conect(){
            try{
                const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.SERVER_DB}/digimons?retryWrites=true&w=majority`;
                await mongoose.connect(queryString);
                console.log('Se ha conectado a la base de datos');
            }catch(e){
                console.log(e);
            }
            
        }
    
        async disconnect(){
            try{
                await mongoose.disconnect();
                console.log('Se ha desconectado de la base de datos.');
            }catch(e){
                console.log(e);
            }
        }
}

export default new dbClient();