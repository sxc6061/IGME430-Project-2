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

const catchPoke = (req, res) => {
    //get random pokemon by id number
    //only original 151 pokemon
    const randPoke = P.getPokemonByName(Math.floor(Math.random() * Math.floor(151)));

    const pokeData = {
        name: randPoke.name,
        type: randPoke.type,
        id: randPoke.id,
        move: randPoke.move,
        img: randPoke.img,
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

const getPokemon = (request, response) => {
    const req = request;
    const res = response;

    return Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ pokemon: docs });
    });
};

module.exports.trainerPage = trainerPage;
module.exports.catchPoke = catchPoke;
module.exports.getPokemon = getPokemon;