import express from "express";
const route = express.Router();
import digimonController from "../controller/digimonController.js";

route.get('/', digimonController.index);
route.post('/buscar',digimonController.buscar);
route.post('/', digimonController.create);
route.get('/getAll', digimonController.getAll);
route.get('/reset', digimonController.reset);

export default route;