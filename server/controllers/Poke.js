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

        return res.render('app', { csrfToken: req.csrfToken(), pokemon: docs });
    });
};

const savePoke = (req, res) => {
    const pokeData = {
        name: req.body.name,
        type: req.body.type,
        id: req.body.id,
        move: req.body.move,
        img: req.body.img,
        owner: req.session.account._id,
    };

    const newCatch = new Poke.PokeModel(pokeData);

    const pokePromise = newCatch.save();

    pokePromise.then(() => res.json({ redirect: '/catch' }));

    pokePromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Pokemon already caught.' });
        }

        return res.status(400).json({ error: 'An error occurred' });
    });

    return pokePromise;
};

const handlePD = (req, res, pokemonData) => {
    let pokeData;
    if (pokemonData.sprites[6]) {
        pokeData = {
            name: pokemonData.name,
            type: pokemonData.type,
            id: pokemonData.id,
            move: pokemonData.move,
            img: pokemonData.sprites[6],
      };
    } else {
        pokeData = {
            name: pokemonData.name,
            type: pokemonData.type,
            id: pokemonData.id,
            move: pokemonData.move,
      };
    }
  
    pokeData = JSON.stringify(pokeData);
    return res.json(pokeData);
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

const callPokemonDB = (request, response) => {
    const req = request;
    const res = response;

    //get random pokemon by id number
    //only original 151 pokemon
    handlePD(req,res,P.getPokemonByName(Math.floor(Math.random() * Math.floor(151))));
};

module.exports.trainerPage = trainerPage;
module.exports.savePoke = savePoke;
module.exports.getPokemon = getPokemon;
module.exports.callPokemonDB = callPokemonDB;