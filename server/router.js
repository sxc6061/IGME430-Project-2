const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getToken', controllers.Account.getToken, mid.requiresSecure);
    app.get('/getPokemon', controllers.Poke.getPokemon, mid.requiresLogin);
    app.get('/callPokeDB', mid.requiresLogin, controllers.Poke.callPokeDB);
    app.post('/catch', mid.requiresLogin, controllers.Poke.savePoke);
    app.get('/login', controllers.Account.loginPage, mid.requiresSecure, mid.requiresLogout);
    app.post('/login', controllers.Account.login, mid.requiresSecure, mid.requiresLogout);
    app.post('/signup', controllers.Account.signup, mid.requiresSecure, mid.requiresLogout);
    app.get('/logout', controllers.Account.logout, mid.requiresLogin);
    app.get('/catch', controllers.Poke.trainerPage, mid.requiresLogin);
    app.get('/', controllers.Account.loginPage, mid.requiresSecure, mid.requiresLogout);
};

module.exports = router;