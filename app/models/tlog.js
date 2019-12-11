var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var TLogSchema = new mongoose.Schema({
    id: {type: Number, index: true, unique: true},
    content: {type: String, index: true},
}, {timestamps: true});

TLogSchema.plugin(autoIncrement.plugin, {
    model: 'TLog',
    field: 'id',
    startAt: 1000,
    incrementBy: 1
});

TLogSchema.plugin(uniqueValidator, {message: 'is already taken.'});

var TLog = mongoose.model('log', TLogSchema);
module.exports = TLog;