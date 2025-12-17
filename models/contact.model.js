import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
       name:{
          type:String,
          required:true,
          trim:true
         },

       phone:{
        type:String,
        required:true
    },
    countryCode:{
        type:String,
        required:true
    }
},
{timestamps:true}
);

const User=mongoose.model("User",userSchema);
export default User;