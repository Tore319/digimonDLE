import "dotenv/config";
import express, { response } from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

try{
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log('Servidor iniciado en el puerto '+ PORT));

    fetch(`https://digimon-api.vercel.app/api/digimon`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
    })
    .then(respuesta => {
        try{
            let digimons = [];
            digimons = JSON.stringify(respuesta);
            digimons = JSON.parse(digimons);

            let random = Math.floor(Math.random() * digimons.length);

            let digimon = digimons[random];

            console.log(digimon);
            
            fetch(`https://digi-api.com/api/v1/digimon/${digimon.name}`)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
            })
            .then(respuesta => {
                console.log(respuesta)
                let digimon = JSON.stringify(respuesta);
                digimon = JSON.parse(digimon);

                //console.log(digimon);
            })
        }catch(e){
            console.log(e.message);
        }
    })
}catch(e){
    console.log(e);
}