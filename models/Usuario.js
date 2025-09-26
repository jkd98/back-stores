import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, "El nombre debe tener al menos 2 caracteres."]
        },
        lastN: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, "El apellido debe tener al menos 2 caracteres."]
        },
        pass: {
            type: String,
            required: true,
            trim: true,
            minLength: [8, "La contraseña debe tener al menos 8 caracteres."]
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email no válido"]
        },
        telf: {
            type:String,
            required:true
        },
        emailConfirm: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: 'Client',
            enum: ['Client', '4DMlN']
        },
        policityAccepted:{
            type:Boolean,
            default:false
        },
        ubic:{
            lat:{type:Number},
            lng:{type:Number}
        }

    },
    {
        timestamps: true
    }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;