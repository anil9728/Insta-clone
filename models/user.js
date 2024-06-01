const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
 name:{
 type:String,
 required:true
 },
 email:{
 type:String,
 required:true
 },
 password:
 {
 type:String,
 required:true
 },
 pic:{
    type:String,
    default:"https://res.cloudinary.com/dsdgyvx1g/image/upload/v1708275769/d60sq9wxizehdquy2rdv.jpg"


 },
 followers:[{type:ObjectId,ref:"user"}],
 following:[{type:ObjectId,ref:"user"}]

})
 mongoose.model("User",userSchema)