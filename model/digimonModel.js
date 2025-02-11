import digimonSchema from "../schemas/digimonSchema.js";

class digimonModel{
    constructor(){

    }

    async getAll(){
        return await digimonSchema.find();
    }

    async getOne(id){
        return await digimonSchema.findById(id);
    }

    async create(digimon){
        return await digimonSchema.create({nombre: digimon});
    }

    async update(id, digimon){
        return await digimonSchema.findByIdAndUpdate(id, digimon);
    }

    async delete(id){
        return await digimonSchema.findByIdAndDelete(id);
    }
}

export default new digimonModel();