var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    title: String,
    type: String,
    description: String,
    url:String,
    price: Number
});


var jbProducts = mongoose.model("product", productSchema);

module.exports = jbProducts; 