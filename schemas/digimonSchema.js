import mongoose  from "mongoose";

const digimonSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'Falta nombre']
        }
    }
)

export default mongoose.model('digimon', digimonSchema);