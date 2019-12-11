var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var CustomerSchema = new mongoose.Schema({
    id: {type: Number, index: true, unique: true},
    name: {type: String, index: true},
    phone: {type: String, index: true},
    amount: {type: Number},
    ishide: {type: Boolean}
}, {timestamps: true});

CustomerSchema.plugin(autoIncrement.plugin, {
    model: 'Customer',
    field: 'id',
    startAt: 1000,
    incrementBy: 1
});

CustomerSchema.plugin(uniqueValidator, {message: 'is already taken.'});

var Customer = mongoose.model('customer', CustomerSchema);
module.exports = Customer;