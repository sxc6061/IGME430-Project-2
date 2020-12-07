const generatePokemon = (e) => {
    e.preventDefault();
    sendAjax('GET', $("#pokeGenerateForm").attr("action"), {}, function (xhr, status, error) {
        setPokeData(xhr);
    });
    return false;
};

const addPokeToDB = (e) => {
    e.preventDefault();
    sendAjax('POST', $("#addToDBForm").attr("action"), $("#addToDBForm").serialize(),
        function (xhr, status, error) {
            loadPokemonFromServer();
        });
    return false;
}

const signUpForPremium = (e) => {
    e.preventDefault();
    if ($("#cardNumber").val == '') {
        handleError("All fields are required");
        return false;
    }

    const data = $("#premiumSignupForm").serialize()
    sendAjax('POST', $("#premiumSignupForm").attr("action"), data,
        function (xhr, status, error) {
            AccountDetailsPage();
        });
    return false;
}

const checkIfAdFree = () => {
    sendAjax('GET', '/getAccountDetails', null, (data) => {
        if (data.isPremium === true) {
            document.querySelector('#adSpace').style.visibility = 'hidden'
        } else {
            document.querySelector('#adSpace').style.visibility = 'visible'
        }
    });
}

const setPokeData = (data) => {
    const pokeData = JSON.parse(data);

    if (pokeData.sprites) {
        document.querySelector('#generatorImage').src = pokeData.sprites;
        document.querySelector('#pokeToSaveSprite').value = `${pokeData.sprites}`;
    } else {
        document.querySelector('#generatorImage').src = "/assets/img/placeholder_image.png";
        document.querySelector('#pokeToSaveSprite').value = "/assets/img/placeholder_image.png";
    }
    document.querySelector('#pokeGeneratorName').innerHTML = `<b>Name:</b> ${pokeData.name}`;
    document.querySelector('#pokeToSaveName').value = `${pokeData.name}`;
    document.querySelector('#pokeGeneratorType').innerHTML = `<b>Type:</b> ${pokeData.type}`;
    document.querySelector('#pokeToSaveType').value = `${pokeData.type}`;
    document.querySelector('#pokeGeneratorID').innerHTML = `<b>ID:</b> ${pokeData.id}`;
    document.querySelector('#pokeToSaveID').value = `${pokeData.id}`;
    document.querySelector('#pokeGeneratorMove').innerHTML = `<b>Move:</b> ${pokeData.move}`;
    document.querySelector('#pokeToSaveMove').value = `${pokeData.move}`;
    document.querySelector('#savePokemon').disabled = false;
};


const PokeGenerator = function (props) {
    return (
        <div>
            <h1 className="heading">Who's that Pokemon</h1>
            <div className="pokeGeneration">
                <div className="pokeInfo">
                    <img id="generatorImage"></img>
                    <p className="generatorInfo" id="pokeGeneratorName"></p>
                    <p className="generatorInfo" id="pokeGeneratorType"></p>
                    <p className="generatorInfo" id="pokeGeneratorID"></p>
                    <p className="generatorInfo" id="pokeGeneratorMove"></p>
                </div>
                <form id="pokeGenerateForm"
                    onSubmit={generatePokemon}
                    name="pokeGenerateForm"
                    action="/callPokeDB"
                    method="GET"
                    className="pokeGenerateForm"
                >
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input id="genPoke" className="inputSubmit" type="submit" value="Generate" />
                </form>

            </div>
            <form
                id="addToDBForm"
                onSubmit={addPokeToDB}
                name="addToDBForm"
                action="/savePokeToDB"
                method="POST"
                className="addToDBForm"
            >
                <input id="pokeToSaveName" type="hidden" name="name" value="" />
                <input id="pokeToSaveType" type="hidden" name="type" value="" />
                <input id="pokeToSaveID" type="hidden" name="id" value="" />
                <input id="pokeToSaveSprite" type="hidden" name="sprite" value="" />
                <input id="pokeToSaveMove" type="hidden" name="move" value="" />
                <input id="csurf" type="hidden" name="_csrf" value={props.csrf} />
                <input id="savePokemon" className="inputSubmit" type="submit" value="Catch Pokemon" disabled />
            </form>
        </div>
    );
};

const PokeList = function (props) {
    if (props.pokemons.length === 0) {
        return (
            <div className="pokeList">

                <h1 className="heading">No Pokemon yet, go catch 'em all!</h1>
            </div>
        );
    };
    const pokeNodes = props.pokemons.map(function (pokemon) {
        return (
            <div key={pokemon._id} className="poke">
                <div className="listImage"><img src={pokemon.sprite} alt="Sprite of Pokemon" className="pokeSprite" /></div>
                <div className="listInfo">
                    <h3 className="pokeListInfo">Name: {pokemon.name}</h3>
                    <h3 className="pokeListInfo">Type: {pokemon.type}</h3>
                    <h3 className="pokeListInfo">ID: {pokemon.id}</h3>
                    <h3 className="pokeListInfo">Move: {pokemon.move}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className="pokeList">
            <h1 className="heading">Your Captured Pokemon</h1>
            {pokeNodes}
        </div>
    );
};

const AccountDetails = function (props) {
    document.querySelector('#errorMessage').innerHTML = "";
    if (props.account.isPremium === false) {
        return (
            <div>
                <h1 className="heading">Account Details</h1>
                <div className="accountDetails">
                    <p className="detail"><b>Username:</b> {props.account.username} </p>
                    <p className="detail"><b>Account Type:</b> Free</p>
                    <p className="detail"><b>Birthday:</b> {props.account.birthday}</p>
                    <p className="detail"><b>Age:</b> {props.account.age}</p>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1 className="heading">Account Details</h1>
                <div className="accountDetails">
                    <p className="detail"><b>Username:</b> {props.account.username} </p>
                    <p className="detail"><b>Account Type:</b> Premium</p>
                    <p className="detail"><b>Birthday:</b> {props.account.birthday}</p>
                    <p className="detail"><b>Age:</b> {props.account.age}</p>
                </div>
            </div>
        );
    }

};



const PremiumForm = function (props) {
    document.querySelector('#errorMessage').innerHTML = "";
    return (
        <div className="premiumSignup">
            <h1 className="heading">Sign Up for Premium</h1>
            <h3>Upgrade to premium for an ad-free experience! All for 5 dollars a month!</h3>
            <form
                id="premiumSignupForm"
                onSubmit={signUpForPremium}
                name="premiumSignupForm"
                action="/signupPremium"
                method="POST"
                className="premiumSignupForm"
            >
                <label htmlFor="cardNumber">Credit Card Number: </label>
                <input id="cardNumber" type="text" name="cardNumber" placeholder="0000000000000000" />
                <input id="csurf" type="hidden" name="_csrf" value={props.csrf} />
                <input className="inputSubmit" type="submit" value="Sign Up" />
            </form>
        </div>
    );
}

const AlreadyPremium = function () {
    document.querySelector('#errorMessage').innerHTML = "";
    return (
        <div className="alreadyPremium">
            <h1 className="heading">You're already a Premium Member</h1>
            <b>Enjoy your ad-free experience!</b>
        </div>
    );
}
const createPokeGenerator = (csrf) => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    ReactDOM.render(
        <PokeGenerator csrf={csrf} />, document.querySelector("#pokeGenerator")
    );
};


const AccountDetailsPage = () => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    sendAjax('GET', '/getAccountDetails', null, (data) => {
        ReactDOM.render(
            <AccountDetails account={data} />, document.querySelector("#pokeGenerator")
        );
    });
}
const loadPokemonFromServer = () => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    sendAjax('GET', '/getPokemon', null, (data) => {
        ReactDOM.render(
            <PokeList pokemons={data.pokemons} />, document.querySelector("#pokeGenerator")
        );
    });
};
const createPremiumSignup = (csrf) => {
    document.querySelector('#errorMessage').innerHTML = "";
    checkIfAdFree();
    sendAjax('GET', '/getAccountDetails', null, (data) => {
        if (data.isPremium === false) {
            ReactDOM.render(
                <PremiumForm csrf={csrf} />,
                document.querySelector("#pokeGenerator")
            );
        } else {
            ReactDOM.render(
                <AlreadyPremium />,
                document.querySelector("#pokeGenerator")
            );
        }
    });
};



const setup = function (csrf) {
    const generateButton = document.querySelector("#generateButton");
    const pokeListButton = document.querySelector("#listButton");
    const accountButton = document.querySelector('#accountButton');
    const premiumButton = document.querySelector('#premiumButton');

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
    accountButton.addEventListener("click", (e) => {
        e.preventDefault();
        AccountDetailsPage();
        return false;
    });
    premiumButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPremiumSignup(csrf);
        return false;
    });
    createPokeGenerator(csrf);

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (results) => {
        setup(results.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});