var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: {type:String, required:true, unique:true},
    email: {type:String, required:true},
    userIdNum: {type: Number, required:true, unique:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    password: {type:String, required:true},
    address: {
        city:{type:String, required:true},
        street:{type:String, required:true},
        houseNum:{type: Number, required:true},
        apt:{type: Number, required:true},
    },
    role: {type:String, required:true},
    
});


var jbUsers = mongoose.model("user", userSchema);

module.exports = jbUsers; 