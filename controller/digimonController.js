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
            res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons})
        }

        async function diario(){
            const digimons = await digimonModel.getAll();
            session.digimons = digimons
            let random = Math.floor(Math.random() * 90);

            const data = digimons[random];
            console.log(data);

            fetch(`https://digi-api.com/api/v1/digimon/${data.nombre}`)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
            })
            .then(response => {
                try{
                    console.log(response.name)
                    let respuestas = [];
                    let data = response
                    session.digimon = data
                    session.respuestas = respuestas;

                    res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons})
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
                    

                    if(digimon2.xAntibody != session.digimon.xAntibody){
                        xAntibody = false;
                    }else{
                        xAntibody = true;
                    }

                    if(digimon2.levels[0].level != session.digimon.levels[0].level){
                        level = false;
                    }else{
                        level = true;
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

                    respuesta.push({img: img, xAntibody: xAntibody, level: level, type: type, atributo: atributo});

                    console.log(respuesta);

                    session.respuestas.push(respuesta);
                }
                res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons})
            })
        }catch(e){
            res.status(500).send(e);
        }
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