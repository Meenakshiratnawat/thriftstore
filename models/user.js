const { string } = require("i/lib/util");
const mongoose = require("mongoose")
const { Schema } = mongoose;
const crypto = require("crypto"); 
const uuidv1 = require("uuid/v1");


// const name = {
//   abc:
const userSchema = new Schema({
 name:{
    type: String,
    required: true,
    maxlength:32,
    trim:true
 },
 lastname: {
    type: String,
    maxlength:32,
    trim: true 
},
email:{
    type: String,
    required: true,
    unique: true,
    trim: true 
},
userinfo:{
   type: String,
   trim: true
},
encry_password: {
    type: string,
    required: true
},
salt: String,
role: {
    type: Number,
    default:0
},
purchases:{
    type: Array,
    default: []
},
}, {timestanps: true}
);

// userSchema
//     .virtual("password")
//     .set(function(password){
//         console.log("password",password)
//         this._password = password;
//         this.salt = uuidv1();
//         this.encry_password = this.securePassword(password);
//     })
//     .get(function(){
//           return this.encry_password;
//     });
// 

 userSchema.pre("save", async function (next) {
    const user = this;
  //  if (user.isModified("password")) {
        this.salt = uuidv1();
      user.encry_password = this.securePassword(user.encry_password);
   // }
  
    next();
  });
userSchema.methods ={

    autheticate : function(plainpassword){
       return this.securePassword(plainpassword) === this.encry_password;
      //return plainpassword === this.encry_password;
    },
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto
            .createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
    }catch(err){
      return "";
    }
}
};
module.exports = mongoose.model("User",userSchema);
