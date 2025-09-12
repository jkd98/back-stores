import mongoose from "mongoose";

const preRegistroSchema = mongoose.Schema(
    {
        name:{type:String},
        lastN:{type:String},
        email:{type:String},
        pass:{type:String},
        token:{type:String}
    },
    {
        timestamps: true
    }
);

const PreRegistro = mongoose.model("PreRegistro", preRegistroSchema);
export default PreRegistro;