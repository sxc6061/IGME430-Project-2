"use strict";

var generatePokemon = function generatePokemon(e) {
  e.preventDefault();
  sendAjax('GET', $("#pokeGenForm").attr("action"), {}, function (xhr, status, error) {
    setPokeData(xhr);
  });
  return false;
};

var addPokeToDB = function addPokeToDB(e) {
  e.preventDefault();
  var data = $("#addToDBForm").serialize();
  sendAjax('POST', $("#addToDBForm").attr("action"), data, function (xhr, status, error) {
    loadPokemonFromServer();
  });
  return false;
};

var setPokeData = function setPokeData(data) {
  var pokeData = JSON.parse(data);
  document.querySelector('#generatorImage').src = pokeData.sprites[6];
  document.querySelector('#pokemonToSavePicture').value = pokeData.sprites[6];
  document.querySelector('#generatorImage').src = "/assets/img/placeholder_image.png";
  document.querySelector('#pokeToSavePicture').value = "/assets/img/placeholder_image.png";
  document.querySelector('#pokeGeneratorName').innerHTML = "<b>Name:</b> ".concat(pokeData.name);
  document.querySelector('#pokeToSaveName').value = "".concat(pokeData.name);
  document.querySelector('#pokeGeneratorType').innerHTML = "<b>Type:</b> ".concat(pokeData.animalType);
  document.querySelector('#pokeToSaveType').value = "".concat(pokeData.type);
  document.querySelector('#petGeneratorID').innerHTML = "<b>ID #:</b> ".concat(pokeData.id);
  document.querySelector('#petToSaveBreed').value = "".concat(pokeData.id);
  document.querySelector('#petGeneratorAge').innerHTML = "<b>Move:</b> ".concat(pokeData.move);
  document.querySelector('#petToSaveAge').value = "".concat(pokeData.move);
};

var PokeGen = function PokeGen(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "heading"
  }, "Pokemon Generator"), /*#__PURE__*/React.createElement("div", {
    className: "pokeGen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petInfo"
  }, /*#__PURE__*/React.createElement("img", {
    id: "generatorImage"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGenName"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGenType"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGenID"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGenMove"
  })), /*#__PURE__*/React.createElement("form", {
    id: "pokeGenForm",
    onSubmit: generatePokemon,
    name: "pokeGenForm",
    action: "/callPokeDB",
    method: "GET",
    className: "pokeGenForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "genPoke",
    className: "genButton",
    type: "submit",
    value: "generate"
  }))), /*#__PURE__*/React.createElement("form", {
    id: "addToDBForm",
    onSubmit: addPokeToDB,
    name: "pokeGenForm",
    action: "/savePokeToDB",
    method: "POST",
    className: "addToDBForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "pokeToSaveName",
    type: "hidden",
    name: "name",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "pokeToSaveType",
    type: "hidden",
    name: "type",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "pokeToSaveID",
    type: "hidden",
    name: "id",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "pokeToSaveMove",
    type: "hidden",
    name: "move",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "pokeToSaveIMG",
    type: "hidden",
    name: "img",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "csurf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  })));
};

var PokeList = function PokeList(props) {
  if (props.pokemon.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pokeList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPoke"
    }, "No Pokemon yet, go ahead and catch some!"));
  }

  var pokeNodes = props.pokemon.map(function (pokemon) {
    return (
      /*#__PURE__*/
      //pokemon listed
      React.createElement("div", {
        key: pokemon._id,
        className: "pokemon"
      }, /*#__PURE__*/React.createElement("img", {
        src: pokemon.img,
        alt: "pokemon _sprite",
        className: "pokeImg"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "pokeName"
      }, "Name: ", pokemon.name), /*#__PURE__*/React.createElement("h3", {
        className: "pokeType"
      }, "Type: ", pokemon.type), /*#__PURE__*/React.createElement("h3", {
        className: "pokeID"
      }, "Pokedex Number: ", pokemon.id), /*#__PURE__*/React.createElement("h3", {
        className: "pokeMove"
      }, "Move: ", pokemon.move))
    );
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "pokeList"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "heading"
  }, "Captured Pokemon"), pokeNodes);
};

var createPokeGenerator = function createPokeGenerator(csrf) {
  document.querySelector('#errorMessage').innerHTML = "";
  ReactDOM.render( /*#__PURE__*/React.createElement(PokeGen, {
    csrf: csrf
  }), document.querySelector("#pokeGen"));
};

var loadPokemonFromServer = function loadPokemonFromServer() {
  document.querySelector('#errorMessage').innerHTML = "";
  sendAjax('GET', '/getPokemon', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PokeList, {
      pokemon: data.pokemon
    }), document.querySelector("#pokeGen"));
  });
};

var setup = function setup(csrf) {
  var generateButton = document.querySelector("#generateButton");
  var pokeListButton = document.querySelector("#listButton");
  generateButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPokeGenerator(csrf);
    return false;
  });
  pokeListButton.addEventListener("click", function (e) {
    e.preventDefault();
    loadPokemonFromServer();
    return false;
  });
  createPokeGenerator(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#pikaMessage').animate({
    width: 'toggle'
  }, 400);
};

var redirect = function redirect(response) {
  $('#pikaMessage').animate({
    width: 'hide'
  }, 400);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
