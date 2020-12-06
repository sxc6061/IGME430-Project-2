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
    let randPoke = P.getPokemonByName(Math.floor(Math.random() * Math.floor(151)));

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

const handlePD = (req, res, pokemonData) => {
    let pokeData;
    if (petData.photos[0]) {
        pokeData = {
            name: pokemonData.name,
            type: pokemonData.type,
            id: pokemonData.id,
            move: pokemonData.move,
            img: pokemonData.sprites[3],
      };
    } else {
        pokeData = {
            name: pokemonData.name,
            type: pokemonData.type,
            id: pokemonData.id,
            move: pokemonData.move,
      };
    }
  
    dataToReturn = JSON.stringify(dataToReturn);
    return res.json(dataToReturn);
  };

const getPokemon = (request, response) => {
    const req = request;
    const res = response;

    client.pokemon.search({
        limit: 100,
      })
        .then((response2) => {
          const rand = Math.round(Math.random() * (100 - 1) + 1);
          handlePD(req, res, response2.data.pokemon[rand]);
    }).catch((error) => res.status(400).json({ error: error.message }));
};

module.exports.trainerPage = trainerPage;
module.exports.catchPoke = catchPoke;
module.exports.getPokemon = getPokemon;