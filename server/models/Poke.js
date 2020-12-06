const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PokeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PokeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  id: {
    type: Number,
    required: true,
    trim: true,
  },
  move: {
    type: String,
    min: 0,
    required: true,
  },
  sprite: {
    type: String,
    trim: true,
    required: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});
PokeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return PokeModel.find(search).select('name type id move sprite').lean().exec(callback);
};

PokeModel = mongoose.model('Poke', PokeSchema);

module.exports.PokeModel = PokeModel;
module.exports.PokeSchema = PokeSchema;
