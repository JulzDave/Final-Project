var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    client: String, 
    creationDate:String 
});


var jbCart = mongoose.model("cart", cartSchema);

module.exports = jbCart; 