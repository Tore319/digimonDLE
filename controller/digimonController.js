import { response } from "express";
import session from 'express-session';

class digimonController{
    constructor(){

    }

    async index(req, res){
        let random = Math.floor(Math.random() * 1460);
        let respuesta = [];

        fetch(`https://digi-api.com/api/v1/digimon/${random}`)
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(respuesta => {
            try{
                let data = respuesta
                console.log(data.name);
                req.session.digimon = data
                req.session.respuesta = respuesta;

                res.render('pages/index', {digimon: data})
            }catch(e){
                console.log(e.message);
                res.status(500).send(e);
            }
        })
    }

    async buscar(req, res){
        try{
            const { nombre } = req.body;

            console.log(nombre, req.session.digimon, req.session.respuesta);

            fetch(`https://digi-api.com/api/v1/digimon/${nombre}`)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
            })
            .then(response => {
                console.log(response)
                // console.log(response.name);
                // console.log(digimon.name);
                // if(response.name == digimon.name){
                //     respuesta.push(true)
                // }else{
                //     respuesta.push(false)
                // }

                // res.redirect( '/digimon/', {respuesta: respuesta});
            })
        }catch(e){
            res.status(500).send(e);
        }
    }
}

export default new digimonController();