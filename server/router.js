const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPokemon', mid.requiresLogin, controllers.Poke.getPokemon);
  app.get('/callPokeDB', mid.requiresLogin, controllers.Poke.callPokemonDB);
  app.post('/savePokeToDB', mid.requiresLogin, controllers.Poke.savePoke);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/resetPassword', mid.requiresSecure, mid.requiresLogout, controllers.Account.resetPassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/list', mid.requiresLogin, controllers.Poke.trainerPage);
  app.post('/signupPremium', mid.requiresLogin, controllers.Account.signupPremium);
  app.get('/getAccountDetails', mid.requiresLogin, controllers.Account.getAccountDetails);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
