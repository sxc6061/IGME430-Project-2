"use strict";

var Pokedex = require('pokedex-promise-v2');

var P = new Pokedex();

var generatePokemon = function generatePokemon(e) {
  e.preventDefault(); //get random pokemon by id number
  //only original 151 pokemon

  var randPoke = P.getPokemonByName(Math.floor(Math.random() * Math.floor(151)));
  console.dir(randPoke);
  sendAjax('GET', $("#pokeGenerateForm").attr("action"), randPoke, function (xhr, status, error) {
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

var signUpForPremium = function signUpForPremium(e) {
  e.preventDefault();

  if ($("#cardNumber").val == '') {
    handleError("All fields are required");
    return false;
  }

  var data = $("#premiumSignupForm").serialize();
  sendAjax('POST', $("#premiumSignupForm").attr("action"), data, function (xhr, status, error) {
    AccountDetailsPage();
  });
  return false;
};

var checkIfAdFree = function checkIfAdFree() {
  sendAjax('GET', '/getAccountDetails', null, function (data) {
    if (data.isPremium === true) {
      document.querySelector('#adSpace').style.visibility = 'hidden';
    } else {
      document.querySelector('#adSpace').style.visibility = 'visible';
    }
  });
};

var setPokeData = function setPokeData(data) {
  var pokeData = JSON.parse(data);

  if (pokeData.sprite) {
    document.querySelector('#generatorImage').src = pokeData.sprite[6];
    document.querySelector('#pokeToSaveSprite').value = pokeData.sprite[6];
  } else {
    document.querySelector('#generatorImage').src = "/assets/img/placeholder_image.png";
    document.querySelector('#pokeToSaveSprite').value = "/assets/img/placeholder_image.png";
  }

  document.querySelector('#pokeGeneratorName').innerHTML = "<b>Name:</b> ".concat(pokeData.name);
  document.querySelector('#pokeToSaveName').value = "".concat(pokeData.name);
  document.querySelector('#pokeGeneratorType').innerHTML = "<b>Type:</b> ".concat(pokeData.type);
  document.querySelector('#pokeToSaveType').value = "".concat(pokeData.type);
  document.querySelector('#pokeGeneratorID').innerHTML = "<b>ID:</b> ".concat(pokeData.id);
  document.querySelector('#pokeToSaveID').value = "".concat(pokeData.id);
  document.querySelector('#pokeGeneratorMove').innerHTML = "<b>Move:</b> ".concat(pokeData.move);
  document.querySelector('#pokeToSaveMove').value = "".concat(pokeData.move);
  document.querySelector('#savePokemon').disabled = false;
};

var PokeGenerator = function PokeGenerator(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "heading"
  }, "Who's that Pokemon"), /*#__PURE__*/React.createElement("div", {
    className: "pokeGeneration"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pokeInfo"
  }, /*#__PURE__*/React.createElement("img", {
    id: "generatorImage"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGeneratorName"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGeneratorType"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGeneratorID"
  }), /*#__PURE__*/React.createElement("p", {
    className: "generatorInfo",
    id: "pokeGeneratorMove"
  })), /*#__PURE__*/React.createElement("form", {
    id: "pokeGenerateForm",
    onSubmit: generatePokemon,
    name: "pokeGenerateForm",
    action: "/callPokeDB",
    method: "GET",
    className: "pokeGenerateForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "genPoke",
    className: "inputSubmit",
    type: "submit",
    value: "Generate"
  }))), /*#__PURE__*/React.createElement("form", {
    id: "addToDBForm",
    onSubmit: addPokeToDB,
    name: "pokeGenerateForm",
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
    id: "pokeToSaveSprite",
    type: "hidden",
    name: "sprite",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "pokeToSaveMove",
    type: "hidden",
    name: "move",
    value: ""
  }), /*#__PURE__*/React.createElement("input", {
    id: "csurf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "savePoke",
    className: "inputSubmit",
    type: "submit",
    value: "Catch Pokemon",
    disabled: true
  })));
};

var PokeList = function PokeList(props) {
  if (props.pokemons.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pokeList"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "heading"
    }, "No Pokemon yet, go catch 'em all!"));
  }

  ;
  var pokeNodes = props.pokemons.map(function (pokemon) {
    return /*#__PURE__*/React.createElement("div", {
      key: pokemon._id,
      className: "poke"
    }, /*#__PURE__*/React.createElement("div", {
      className: "listImage"
    }, /*#__PURE__*/React.createElement("img", {
      src: pokemon.sprite,
      alt: "Sprite of Pokemon",
      className: "pokeSprite"
    })), /*#__PURE__*/React.createElement("div", {
      className: "listInfo"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "pokeListInfo"
    }, "Name: ", pokemon.name), /*#__PURE__*/React.createElement("h3", {
      className: "pokeListInfo"
    }, "Type: ", pokemon.type), /*#__PURE__*/React.createElement("h3", {
      className: "pokeListInfo"
    }, "ID: ", pokemon.id), /*#__PURE__*/React.createElement("h3", {
      className: "pokeListInfo"
    }, "Move: ", pokemon.move)));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "pokeList"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "heading"
  }, "Your Captured Pokemon"), pokeNodes);
};

var AccountDetails = function AccountDetails(props) {
  document.querySelector('#errorMessage').innerHTML = "";

  if (props.account.isPremium === false) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "heading"
    }, "Account Details"), /*#__PURE__*/React.createElement("div", {
      className: "accountDetails"
    }, /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Username:"), " ", props.account.username, " "), /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Account Type:"), " Free"), /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Birthday:"), " ", props.account.birthday), /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Age:"), " ", props.account.age)));
  } else {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "heading"
    }, "Account Details"), /*#__PURE__*/React.createElement("div", {
      className: "accountDetails"
    }, /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Username:"), " ", props.account.username, " "), /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Account Type:"), " Premium"), /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Birthday:"), " ", props.account.birthday), /*#__PURE__*/React.createElement("p", {
      className: "detail"
    }, /*#__PURE__*/React.createElement("b", null, "Age:"), " ", props.account.age)));
  }
};

var PremiumForm = function PremiumForm(props) {
  document.querySelector('#errorMessage').innerHTML = "";
  return /*#__PURE__*/React.createElement("div", {
    className: "premiumSignup"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "heading"
  }, "Sign Up for Premium"), /*#__PURE__*/React.createElement("h3", null, "Upgrade to premium for an ad-free experience! All for 5 dollars a month!"), /*#__PURE__*/React.createElement("form", {
    id: "premiumSignupForm",
    onSubmit: signUpForPremium,
    name: "premiumSignupForm",
    action: "/signupPremium",
    method: "POST",
    className: "premiumSignupForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cardNumber"
  }, "Credit Card Number: "), /*#__PURE__*/React.createElement("input", {
    id: "cardNumber",
    type: "text",
    name: "cardNumber",
    placeholder: "0000000000000000"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csurf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "inputSubmit",
    type: "submit",
    value: "Sign Up"
  })));
};

var AlreadyPremium = function AlreadyPremium() {
  document.querySelector('#errorMessage').innerHTML = "";
  return /*#__PURE__*/React.createElement("div", {
    className: "alreadyPremium"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "heading"
  }, "You're already a Premium Member"), /*#__PURE__*/React.createElement("b", null, "Enjoy your ad-free experience!"));
};

var createPokeGenerator = function createPokeGenerator(csrf) {
  document.querySelector('#errorMessage').innerHTML = "";
  checkIfAdFree();
  ReactDOM.render( /*#__PURE__*/React.createElement(PokeGenerator, {
    csrf: csrf
  }), document.querySelector("#pokeGenerator"));
};

var AccountDetailsPage = function AccountDetailsPage() {
  document.querySelector('#errorMessage').innerHTML = "";
  checkIfAdFree();
  sendAjax('GET', '/getAccountDetails', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountDetails, {
      account: data
    }), document.querySelector("#pokeGenerator"));
  });
};

var loadPokemonFromServer = function loadPokemonFromServer() {
  document.querySelector('#errorMessage').innerHTML = "";
  checkIfAdFree();
  sendAjax('GET', '/getPokemon', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PokeList, {
      pokemons: data.pokemons
    }), document.querySelector("#pokeGenerator"));
  });
};

var createPremiumSignup = function createPremiumSignup(csrf) {
  document.querySelector('#errorMessage').innerHTML = "";
  checkIfAdFree();
  sendAjax('GET', '/getAccountDetails', null, function (data) {
    if (data.isPremium === false) {
      ReactDOM.render( /*#__PURE__*/React.createElement(PremiumForm, {
        csrf: csrf
      }), document.querySelector("#pokeGenerator"));
    } else {
      ReactDOM.render( /*#__PURE__*/React.createElement(AlreadyPremium, null), document.querySelector("#pokeGenerator"));
    }
  });
};

var setup = function setup(csrf) {
  var generateButton = document.querySelector("#generateButton");
  var pokeListButton = document.querySelector("#listButton");
  var accountButton = document.querySelector('#accountButton');
  var premiumButton = document.querySelector('#premiumButton');
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
  accountButton.addEventListener("click", function (e) {
    e.preventDefault();
    AccountDetailsPage();
    return false;
  });
  premiumButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPremiumSignup(csrf);
    return false;
  });
  createPokeGenerator(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (results) {
    setup(results.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#pokeMessage').animate({
    width: 'toggle'
  }, 350);
};

var handleLoginError = function handleLoginError(message) {
  $('#loginErrorMessage').text(message);
  $('#pokeMessage').animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $('#pokeMessage').animate({
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
