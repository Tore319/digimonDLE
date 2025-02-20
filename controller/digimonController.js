import { response } from "express";
import session from 'express-session';
import digimonModel from "../model/digimonModel.js";

class digimonController{
    constructor(){

    }

    async index(req, res){
        // Comprueba si la varibale de sesion digimon esta inicializada
        if(!session.digimon){
            diario() // Ejecuta la funcion para conseguir el digimon aleatorio
        }else{ // Si esta inicializada manda a la view
            res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons, victory: session.victory});
        }

        async function diario(){
            const digimons = await digimonModel.getAll(); // Recoje todos los digimons
            session.digimons = digimons // Instancia la variable de session
            let random = Math.floor(Math.random() * 90); 

            const data = digimons[random]; // Coge un digimon aleatorio

            // Busca en la API el digimon
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

                    // Instancia las distintas variables de session
                    let respuestas = [];
                    let data = response
                    session.digimon = data
                    session.respuestas = respuestas;
                    session.victory = false;

                    // Renderiza la pagina de inicio
                    res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons, victory: session.victory});
                }catch(e){
                    console.log(e.message);
                    res.status(500).send(e);
                }
            })
        }
    }

    // Funcion para buscar el digimon y compararlo con el random
    async buscar(req, res){
        if(session.victory != true){ // Comprueba que no se haya ganado
            try{
                // Comprueba la variable de session nombres 
                if(!session.nombres){ 
                    let nombres = [''];
                    session.nombres = nombres;
                }

                let comp = false;
                let aux = false;
                const { nombre } = req.body;

                console.log(nombre);

                session.nombres.forEach(nom => {
                    // Compruebo que el nombre no este vacio o este repetido
                    if(!nombre || nombre == '' || nom.toUpperCase() == nombre.toUpperCase()){
                        comp = true
                        console.log("Comp: " + comp);
                    }
                    // Filtro los digimons que ya se han buscado
                    session.digimons.forEach(digi => {  
                        if(digi.nombre.toUpperCase() == nombre.toUpperCase()){
                            session.digimons = session.digimons.filter(digi => digi.nombre.toUpperCase() !== nombre.toUpperCase());
                            aux = true;
                        }
                    });
                });
                
                if(!comp && aux){
                    session.nombres.push(nombre);
                    console.log(session.nombres);
                    // Busco el digimon
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
                        
                        if(digimon2.name == session.digimon.name){ // Si adivina el digimon
                            xAntibody = true;
                            level = true;
                            type = true;
                            atributo = true;
        
                            respuesta.push({img: img, xAntibody: [xAntibody, digimon2.xAntibody], level: [level, digimon2.levels[0].level], type: [type, digimon2.types[0].type], atributo: [atributo, digimon2.attributes[0].attribute]});
        
                            session.respuestas.push(respuesta);
        
                            session.victory = true;
        
                            res.render('pages/index', {respuestas: session.respuestas, digimons: session.digimons, victory: session.victory})
                        }else{ // Si no lo adivina
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
        
                            session.respuestas.push(respuesta);
        
                            res.redirect('/');
                        }
                    })
                }else{
                    console.log('error');
                    res.redirect('/');
                }
                }catch(e){
                    res.status(500).send(e);
                }
            }else{
                res.redirect('/');
            }
        }

    async reset(req, res){ // Funcion para resetear el digimon aleatorio
        session.digimon = '';
        session.nombres = [''];

        res.redirect('/');
    }

    // Esta funcion sirve para almacenar los digimons en la BBDD
    async create(req, res){
        try{
            // Bucle para conseguir Digimons
            for(let i = 1; i < 100; i++){
                await new Promise(r => setTimeout(r, 1000)); // Cada 1s hace la llamada a la API para que no bloque la conexion
                fetch(`https://digi-api.com/api/v1/digimon/${i}`)
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }else{
                        console.log('Error al recibir los datos');
                    }
                })
                .then(todos => {
                    meter(todos); // Funcion para filtrar los digimons
                })
            }

            async function meter(todos) {
                // Comprueba que el digimon tiene los atributos
                if(todos.types.length > 0 && todos.attributes.length > 0 && todos.levels.length > 0){
                    console.log(todos.name);
                    // Lo guarda en la BBDD
                    await digimonModel.create(todos.name);
                }
            }
        }catch(e){
            res.status(500).send(e)
        }
    }
}

export default new digimonController();