var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productCategorySchema = new Schema({
    category: String,   
});


var jbProductCategory = mongoose.model("category", productCategorySchema);

module.exports = jbProductCategory; 