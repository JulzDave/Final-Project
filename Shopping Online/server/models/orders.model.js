var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    userID: { type: String, required: true },
    cartID: { type: String, required: true, unique: true },
    debit: { type: Number, required: true },
    scheduled: { type: String, required: true },
    generated: { type: String, required: true },
    address: {
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNum: { type: Number, required: true },
        apt: { type: Number, required: true }
    },
    payment: {
        card: { type: String, required: true },
        cvv: { type: String, required: true },
        cardExp: { type: String, required: true }
    }

});


var jbOrders = mongoose.model("order", orderSchema);

module.exports = jbOrders; 