import "dotenv/config";
import express, { response } from "express";
import bodyParser from "body-parser";
import digimonRoute from "./route/digimonRoute.js";
import session from 'express-session';
import dbClient from "./config/dbClient.js";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/digimon', digimonRoute);

app.use(session({
    secret: '1234',
    resave: false,           
    saveUninitialized: false,
    cookie: { secure: false }
}));

try{
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log('Servidor iniciado en el puerto '+ PORT));

}catch(e){
    console.log(e);
}

process.on('SIGINT', async() => {
    dbClient.disconnect();
    process.exit(0);
});