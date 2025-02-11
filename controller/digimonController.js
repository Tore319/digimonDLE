import { response } from "express";
import session from 'express-session';

class digimonController{
    constructor(){

    }

    async index(req, res){
        if(!session.digimon){
            diario()
        }else{
            res.render('pages/index', {respuestas: session.respuestas})
        }

        function diario(){
            let random = Math.floor(Math.random() * 1460);
            fetch(`https://digi-api.com/api/v1/digimon/${random}`)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
            })
            .then(response => {
                try{
                    console.log(response)
                    let respuestas = [];
                    let data = response
                    console.log('Inicio ' + data.name + ', Nivel ' + data.levels[0].level + ', Tipo ' + data.types[0].type);
                    session.digimon = data
                    session.respuestas = respuestas;

                    res.render('pages/index', {respuestas: session.respuestas})
                }catch(e){
                    console.log(e.message);
                    res.status(500).send(e);
                }
            })
        }
    }

    async buscar(req, res){
        try{
            const { nombre } = req.body;

            console.log('Nombre form: ' + nombre);
            console.log('Sessions ' + session.digimon.name, session.respuesta);

            fetch(`https://digi-api.com/api/v1/digimon/${nombre}`)
            .then(response => {
                if(response.ok){
                    return response.json();
                }else{
                    console.log('Digimon no encontrado');
                }
            })
            .then(response => {
                //console.log(response)
                let digimon2 = response;
                if(digimon2.name == session.digimon.name){
                    session.respuestas.push(true)
                }else{
                    let respuesta = [];
                    let xAntibody = '';
                    let level = '';
                    let atributo = '';
                    let type = '';
                    let img = digimon2.images[0].href;
                    
                    console.log(digimon2.xAntibody);
                    if(digimon2.xAntibody != session.digimon.xAntibody){
                        xAntibody = false;
                    }else{
                        xAntibody = true;
                    }

                    console.log(digimon2.levels[0].level);
                    if(session.digimon.levels[0]){
                        if(digimon2.levels[0].level != session.digimon.levels[0].level){
                            level = false;
                        }else{
                            level = true;
                        }
                    }

                    console.log(digimon2.types[0].type);
                    if(session.digimon.types[0]){
                        if(digimon2.types[0].type == session.digimon.types[0].type){
                            type = true;
                        }else{
                            type = false
                        }
                    }

                    if(session.digimon.attributes[0]){
                        if(digimon2.attributes[0].attribute == session.digimon.attributes[0].attribute){
                            atributo = true;
                        }else{
                            atributo = false
                        }
                    }

                    respuesta.push({img: img, xAntibody: xAntibody, level: level, type: type, atributo: atributo});

                    console.log(respuesta);

                    session.respuestas.push(respuesta);
                }
                res.render('pages/index', {respuestas: session.respuestas})
            })
        }catch(e){
            res.status(500).send(e);
        }
    }
}

export default new digimonController();