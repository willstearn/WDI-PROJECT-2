//require users
const User = require('../models/user');

function indexRoute(req, res) {
  User
    .find()
    .exec()
    .then((users) => {
      res.render('statics/home',{ users });
    });
}

module.exports = {
  index: indexRoute
};
