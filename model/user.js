import mongoose from "mongoose";
const userschema=mongoose.Schema({
   firstname: {
type:String,
required:true
    },
    lastname:{
        type:String,
required:true
    },
    email:{
        type:String,
        required:true
    },
password:{
    type:String,
    required:true,
    unique:true
}

})
export const User=mongoose.model('user',userschema)