import { response } from "express";
import session from 'express-session';
import digimonModel from "../model/digimonModel.js";

class digimonController{
    constructor(){

    }

    async index(req, res){
        if(!session.digimon){
            diario()
        }else{
            res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons, victory: session.victory});
        }

        async function diario(){
            const digimons = await digimonModel.getAll();
            session.digimons = digimons
            let random = Math.floor(Math.random() * 90);

            const data = digimons[random];

            fetch(`https://digi-api.com/api/v1/digimon/${data.nombre}`)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
            })
            .then(response => {
                try{
                    console.log(response.name)
                    console.log(response.xAntibody)
                    console.log(response.levels[0].level)
                    console.log(response.types[0].type)
                    console.log(response.attributes[0].attribute)

                    let respuestas = [];
                    let data = response
                    session.digimon = data
                    session.respuestas = respuestas;
                    session.victory = false;

                    res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons, victory: session.victory});
                }catch(e){
                    console.log(e.message);
                    res.status(500).send(e);
                }
            })
        }
    }

    async buscar(req, res){
        if(session.victory != true){
            try{
                const { nombre } = req.body;

                if(!nombre || nombre == ''){
                    return res.redirect('/digimon');
                }
    
                fetch(`https://digi-api.com/api/v1/digimon/${nombre}`)
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }else{
                        console.log('Digimon no encontrado');
                    }
                })
                .then(response => {
                    let digimon2 = response;
                    let respuesta = [];
                    let xAntibody = '';
                    let level = '';
                    let atributo = '';
                    let type = '';
                    let img = digimon2.images[0].href;
    
                    if(digimon2.name == session.digimon.name){
                        xAntibody = true;
                        level = true;
                        type = true;
                        atributo = true;
    
                        respuesta.push({img: img, xAntibody: [xAntibody, digimon2.xAntibody], level: [level, digimon2.levels[0].level], type: [type, digimon2.types[0].type], atributo: [atributo, digimon2.attributes[0].attribute]});
    
                        session.respuestas.push(respuesta);
    
                        session.victory = true;
    
                        res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons, victory: session.victory})
                    }else{
                        if(digimon2.xAntibody == session.digimon.xAntibody){
                            xAntibody = true;
                        }else{
                            xAntibody = false;
                        }
    
                        if(digimon2.levels[0].level == session.digimon.levels[0].level){
                            level = true;
                        }else{
                            level = false;
                        }
    
                        if(digimon2.types[0].type == session.digimon.types[0].type){
                            type = true;
                        }else{
                            type = false
                        }
    
                        if(digimon2.attributes[0].attribute == session.digimon.attributes[0].attribute){
                            atributo = true;
                        }else{
                            atributo = false
                        }
    
                        respuesta.push({img: img, xAntibody: [xAntibody, digimon2.xAntibody], level: [level, digimon2.levels[0].level], type: [type, digimon2.types[0].type], atributo: [atributo, digimon2.attributes[0].attribute]});
    
                        console.log(respuesta);
    
                        session.respuestas.push(respuesta);
    
                        res.redirect('/digimon');
                    }
                })
            }catch(e){
                res.status(500).send(e);
            }
        }else{
            res.redirect('/digimon');
        }
    }

    async reset(req, res){
        session.digimon = '';

        res.redirect('/digimon');
    }

    async create(req, res){
        try{
            for(let i = 1; i < 100; i++){
                await new Promise(r => setTimeout(r, 1000));
                fetch(`https://digi-api.com/api/v1/digimon/${i}`)
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }else{
                        console.log('Error al recibir los datos');
                    }
                })
                .then(todos => {
                    meter(todos);
                })
            }

            async function meter(todos) {
                if(todos.types.length > 0 && todos.attributes.length > 0 && todos.levels.length > 0){
                    console.log(todos.name);
                    await digimonModel.create(todos.name);
                }
            }
        }catch(e){
            res.status(500).send(e)
        }
    }

    async getAll(req, res){
        try{
            const data = await digimonModel.getAll();
            
            res.status(200).json(data);
        }catch(e){
            res.status(500).send(e);
        }
    }
}

export default new digimonController();