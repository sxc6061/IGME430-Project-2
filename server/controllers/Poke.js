const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const models = require('../models');

const Poke = models.Poke;

const trainerPage = (req, res) => {
  Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), pokemons: docs });
  });
};
const savePoke = (req, res) => {
  const pokeData = {
    name: req.body.name,
    type: req.body.type,
    id: req.body.id,
    move: req.body.move,
    sprite: req.body.sprites[6],
    owner: req.session.account._id,
  };
  const newPoke = new Poke.PokeModel(pokeData);

  const pokePromise = newPoke.save();

  pokePromise.then(() => res.json({}));

  pokePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Pokemon already captured' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return pokePromise;
};

const getPokemon = (request, response) => {
  const req = request;
  const res = response;
  return Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ pokemons: docs });
  });
};


const handlePokeData = (req, res, pokeData) => {
  let returnData;
  if (pokeData.sprites[6]) {
    returnData = {
      name: pokeData.name,
      type: pokeData.type[0].name,
      id: pokeData.id,
      move: pokeData.moves[0].move.name,
      sprite: pokeData.sprites.front_default,
    };
  } else {
    returnData = {
      name: pokeData.name,
      type: pokeData.type[0].name,
      id: pokeData.id,
      move: pokeData.moves[0].move.name,
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
  P.getPokemonByName(Math.floor(Math.random() * Math.floor(151)))
    .then(function(pokeData) {
      console.dir(pokeData);
      return handlePokeData(req,res,pokeData);
    })
    .catch(function(error) {
      console.log(error);
    });
};

module.exports.trainerPage = trainerPage;
module.exports.getPokemon = getPokemon;
module.exports.savePoke = savePoke;
module.exports.callPokemonDB = callPokemonDB;
