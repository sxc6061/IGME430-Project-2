"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#pikaMessage").animate({
    width: 'toggle'
  }, 350);
};

var sendAjax = function sendAjax(action, data) {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: function success(result, status, xhr) {
      $("#pikaMessage").animate({
        width: 'hide'
      }, 350);
      window.location = result.redirect;
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

$(document).ready(function () {
  $("#signupForm").on("submit", function (e) {
    e.preventDefault();
    $("#pikaMessage").animate({
      width: 'hide'
    }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("PIKA! All fields are required");
      return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
      handleError("PIKA! Passwords do not match");
      return false;
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
    return false;
  });
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    $("#pikaMessage").animate({
      width: 'hide'
    }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
      handleError("PIKA! Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());
    return false;
  });
});
