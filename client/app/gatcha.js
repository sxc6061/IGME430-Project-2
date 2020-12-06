const generatePokemon = (e) => {
    e.preventDefault();
    sendAjax('GET', $("#pokeGenForm").attr("action"), {}, function (xhr, status, error) {
        setPokeData(xhr);
    });
    return false;
};

const addPokeToDB = (e) => {
    e.preventDefault();
    const data = $("#addToDBForm").serialize()
    sendAjax('POST', $("#addToDBForm").attr("action"), data,
        function (xhr, status, error) {
            loadPokemonFromServer();
        });
    return false;
};

const setPokeData = (data) => {
    const pokeData = JSON.parse(data);

    document.querySelector('#generatorImage').src = pokeData.sprites[6];
    document.querySelector('#pokemonToSavePicture').value = pokeData.sprites[6];
    document.querySelector('#generatorImage').src = "/assets/img/placeholder_image.png";
    document.querySelector('#pokeToSavePicture').value = "/assets/img/placeholder_image.png";
    document.querySelector('#pokeGeneratorName').innerHTML = `<b>Name:</b> ${pokeData.name}`;
    document.querySelector('#pokeToSaveName').value = `${pokeData.name}`;
    document.querySelector('#pokeGeneratorType').innerHTML = `<b>Type:</b> ${pokeData.animalType}`;
    document.querySelector('#pokeToSaveType').value = `${pokeData.type}`;
    document.querySelector('#petGeneratorID').innerHTML = `<b>ID #:</b> ${pokeData.id}`;
    document.querySelector('#petToSaveBreed').value = `${pokeData.id}`;
    document.querySelector('#petGeneratorAge').innerHTML = `<b>Move:</b> ${pokeData.move}`;
    document.querySelector('#petToSaveAge').value = `${pokeData.move}`;
};

const PokeGen = function (props) {
    return (
        <div>
            <h1 className="heading">Pokemon Generator</h1>
            <div className="pokeGen">
                <div className="petInfo">
                    <img id="generatorImage"></img>
                    <p className="generatorInfo" id="pokeGenName"></p>
                    <p className="generatorInfo" id="pokeGenType"></p>
                    <p className="generatorInfo" id="pokeGenID"></p>
                    <p className="generatorInfo" id="pokeGenMove"></p>
                </div>
                <form id="pokeGenForm"
                    onSubmit={generatePokemon}
                    name="pokeGenForm"
                    action="/callPokeDB"
                    method="GET"
                    className="pokeGenForm"
                >
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input id="genPoke" className="genButton" type="submit" value="generate" />
                </form>

            </div>
            <form
                id="addToDBForm"
                onSubmit={addPokeToDB}
                name="pokeGenForm"
                action="/savePokeToDB"
                method="POST"
                className="addToDBForm"
            >
                <input id="pokeToSaveName" type="hidden" name="name" value="" />
                <input id="pokeToSaveType" type="hidden" name="type" value="" />
                <input id="pokeToSaveID" type="hidden" name="id" value="" />
                <input id="pokeToSaveMove" type="hidden" name="move" value="" />
                <input id="pokeToSaveIMG" type="hidden" name="img" value="" />
                <input id="csurf" type="hidden" name="_csrf" value={props.csrf} />
            </form>
        </div>
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
            <h1 className="heading">Captured Pokemon</h1>
            {pokeNodes}
        </div>
    );
};

const createPokeGenerator = (csrf) => {
    document.querySelector('#errorMessage').innerHTML = "";
    ReactDOM.render(
        <PokeGen csrf={csrf} />,
        document.querySelector("#pokeGen")
    );
};

const loadPokemonFromServer = () => {
    document.querySelector('#errorMessage').innerHTML = "";
    sendAjax('GET', '/getPokemon', null, (data) => {
        ReactDOM.render(
            <PokeList pokemon={data.pokemon} />, document.querySelector("#pokeGen")
        );
    });
};

const setup = function(csrf) {
    const generateButton = document.querySelector("#generateButton");
    const pokeListButton = document.querySelector("#listButton");

    generateButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPokeGenerator(csrf);
        return false;
    });
    pokeListButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadPokemonFromServer();
        return false;
    });

    createPokeGenerator(csrf);
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});