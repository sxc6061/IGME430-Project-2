var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
const models = require('../models');

const { Poke } = models;

const listPage = (req, res) => {
  Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), pokemon: docs });
  });
};
const savePoke = (req, res) => {
  const pokeData = {
    name: req.body.name,
    type: req.body.type,
    id: req.body.id,
    picture: req.body.picture,
    age: req.body.age,
    owner: req.session.account._id,
  };
  const newPoke = new Poke.PokeModel(pokeData);

  const pokePromise = newPoke.save();

  pokePromise.then(() => res.json({}));

  pokePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Pet already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return petPromise;
};

const getPokemon = (request, response) => {
  const req = request;
  const res = response;
  return Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ pokemon: docs });
  });
};


const handlePokeData = (req, res, pokeData) => {
  let returnData;
  if (pokeData.photos[6]) {
    returnData = {
      name: pokeData.name,
      type: pokeData.type,
      id: pokeData.id,
      move: pokeData.move,
      photos: pokeData.sprites[6],
    };
  } else {
    returnData = {
      name: pokeData.name,
      type: pokeData.type,
      id: pokeData.id,
      move: pokeData.move,
    };
  }

  returnData = JSON.stringify(returnData);
  return res.json(returnData);
};

const callPokemonDB = (request, response) => {
  const req = request;
  const res = response;

  //get random pokemon by id number
  //only original 151 pokemon
  let randPoke = P.getPokemonByName(Math.floor(Math.random() * Math.floor(151)));
  handlePokeData(req,res,randPoke);
};

module.exports.listPage = listPage;
module.exports.getPokemon = getPokemon;
module.exports.savePoke = savePoke;
module.exports.callPokemonDB = callPokemonDB;
