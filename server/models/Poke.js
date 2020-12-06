const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let PokeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PokeSchema = new mongoose.Schema({
    //get multiple info for pokemon to add
    name: {
        type: String,
        required: true,
        set: setName,
    },
    type: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        min: 0,
        required: true,
    },
    move: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
    },
    trainerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    captureDate: {
        type: Date,
        default: Date.now,
    },
});

PokeSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    type: doc.type,
    id: doc.id,
    move: doc.move,
});

PokeSchema.statics.findByOwner = (trainerId, callback) => {
    const search = {
        trainer: convertId(trainerId),
    };

    return PokeModel.find(search).select('name type id move img').lean().exec(callback);
};

PokeModel = mongoose.model('Poke', PokeSchema);

module.exports.PokeModel = PokeModel;
module.exports.PokeSchema = PokeSchema;