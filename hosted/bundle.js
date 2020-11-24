"use strict";

var Pokedex = require('pokedex-promise-v2');

var P = new Pokedex();

var handlePoke = function handlePoke(e) {
  e.preventDefault();
  $('#pikaMessage').animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $('#pokeButton').attr('action'), $('#pokeButton').serialize(), function () {
    loadPokemonFromServer();
  });
  return false;
};

var PokeButton = function PokeButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    id: "pokeButton",
    onClick: handlePoke,
    name: "pokeButton",
    action: "/catch",
    method: "POST"
  }, "Who's that Pokemon?");
};

var PokeList = function PokeList(props) {
  if (props.pokemon.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pokeList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPoke"
    }, "No Pokemon yet, go ahead and roll for some!"));
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
  }, pokeNodes);
};

var loadPokemonFromServer = function loadPokemonFromServer() {
  sendAjax('GET', '/getPokemon', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PokeList, {
      pokemon: data.pokemons
    }), document.querySelector('#pokemon'));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PokeButton, {
    csrf: csrf
  }), document.querySelector('#catchPokemon'));
  ReactDOM.render( /*#__PURE__*/React.createElement(PokeList, {
    pokemon: []
  }), document.querySelector('#pokemon'));
  loadDomosFromServer();
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
  }, 350);
};

var redirect = function redirect(response) {
  $('#pikaMessage').animate({
    width: 'hide'
  }, 350);
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
