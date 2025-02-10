import express from "express";
const route = express.Router();
import digimonController from "../controller/digimonController.js";

route.get('/', digimonController.index);
route.post('/buscar',digimonController.buscar);

export default route;