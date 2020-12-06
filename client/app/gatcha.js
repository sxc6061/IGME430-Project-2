const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

const handlePoke = (e) => {
    e.preventDefault();
    console.dir(P.getPokemonByName(Math.floor(Math.random() * Math.floor(151))));
    sendAjax('POST', $('#pokeButton').attr('action'), function() {
        loadPokemonFromServer();
    });

    return false;
};

const PokeButton = () => {
    return (
        <form id="pokeButton"
            onClick={handlePoke}
            name="pokeButton"
            action="/catch"
            method="POST"
            className="pokeButton"
            >
                <input className="pokemonRoll" type="submit" value="Who's that Pokemon?"/>
            </form>
    );
};

const PokeList = function(props) {
    if(props.pokemon.length === 0){
        return(
            <div className="pokeList">
                <h3 className="emptyPoke">No Pokemon yet, go ahead and catch some!</h3>
            </div>
        );
    } 

    const pokeNodes = props.pokemon.map(function(pokemon) {
        return (
            //pokemon listed
            <div key={pokemon._id} className="pokemon">
                <img src={pokemon.img} alt="pokemon _sprite" className="pokeImg"/>
                <h3 className="pokeName">Name: {pokemon.name}</h3>
                <h3 className="pokeType">Type: {pokemon.type}</h3>
                <h3 className="pokeID">Pokedex Number: {pokemon.id}</h3>
                <h3 className="pokeMove">Move: {pokemon.move}</h3>
            </div>
        );
    });

    return (
        <div className="pokeList">
            {pokeNodes}
        </div>
    );
};

const loadPokemonFromServer = () => {
    sendAjax('GET', '/getPokemon', null, (data) => {
        ReactDOM.render(
            <PokeList pokemon={data.pokemon} />, document.querySelector('#pokemon')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <PokeButton csrf={csrf}/>, document.querySelector('#catchPokemon')
    );

    ReactDOM.render(
        <PokeList pokemon={[]}/>, document.querySelector('#pokemon')
    );

    loadPokemonFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});