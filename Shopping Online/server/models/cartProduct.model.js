var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartprodSchema = new Schema({
    prodID:String,
    cartID:String,
    amount:Number,
    totalPrice:Number,
    
});


var jbCartProd = mongoose.model("cartProduct", cartprodSchema);

module.exports = jbCartProd; 