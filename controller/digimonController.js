import { response } from "express";
import session from 'express-session';

class digimonController{
    constructor(){

    }

    async index(req, res){
        if(!session.digimon){
            diario()
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
                    let respuesta = [];
                    let data = response
                    console.log('Inicio ' + data.name);
                    session.digimon = data
                    session.respuesta = respuesta;

                    res.render('pages/index', {digimon: data})
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
                }
            })
            .then(response => {
                //console.log(response.name)
                // console.log(response.name);
                // console.log(digimon.name);
                // if(response.name == digimon.name){
                //     respuesta.push(true)
                // }else{
                //     respuesta.push(false)
                // }

                res.redirect( '/digimon/');
            })
        }catch(e){
            res.status(500).send(e);
        }
    }
}

export default new digimonController();