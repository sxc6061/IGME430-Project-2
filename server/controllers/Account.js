const models = require('../models');
const { AccountModel } = require('../models/Account');

const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
const login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'PIKA! All fields are required' });
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password' });
    }
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/list' });
  });
};
const signup = (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.birthday = `${req.body.birthday}`;
  req.body.age = `${req.body.age}`;
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'PIKA! All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'PIKA! Passwords do not match' });
  }
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      birthday: req.body.birthday,
      age: req.body.age,
      isPremium: false,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/list' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const changePassword = (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const newAccountData = {
      salt,
      password: hash,
    };
    const search = {
      username: req.body.username,
    };


    Account.AccountModel.findOne(search, (err, foundAccount) => {
      const account = foundAccount;
      if (err) {
        return res.status(400).json({ error: 'An error occured' });
      }
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      account.salt = newAccountData.salt;
      account.password = newAccountData.password;
      const savePromise = account.save();
      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(account);
        res.json({ redirect: '/list' });
      });
      savePromise.catch((err2) => {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      });
      return false;
    });
  });
};

const signupPremium = (req, res) => {
  if (!req.body.cardNumber) {
    return res.status(400).json({ error: 'You must put in a valid credit card number' });
  }
  req.body.cardNumber = `${req.body.cardNumber}`;
  return Account.AccountModel.generateHash(req.body.cardNumber, (salt, hash) => {
    const newAccountData = {
      creditCardNumberSalt: salt,
      creditCardNumber: hash,
    };
    const search = {
      username: req.session.account.username,
    };
    AccountModel.findOne(search, (err, foundAccount) => {
      const account = foundAccount;
      if (err) {
        return res.status(400).json({ error: 'An error occured' });
      }
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      account.creditCardNumberSalt = newAccountData.creditCardNumberSalt;
      account.creditCardNumber = newAccountData.creditCardNumber;
      account.isPremium = true;
      const savePromise = account.save();
      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(account);
        res.json({ redirect: '/list' });
      });
      savePromise.catch((err2) => {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      });
      return false;
    });
  });
};


const getAccountDetails = (request, response) => {
  const req = request;
  const res = response;

  let randPoke = P.getPokemonByName(Math.floor(Math.random() * Math.floor(151)));
  console.dir(randPoke);

  res.json(req.session.account);
};

const getToken = (request, response) => {
  const req = request;
  const res = response;
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports.resetPassword = changePassword;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.getAccountDetails = getAccountDetails;
module.exports.signupPremium = signupPremium;
