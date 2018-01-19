const User = require('../models/user');

// req.user = user;


function authentication(req, res, next) {
  if(!req.session.userId) return next();

  User
    .findById(req.session.userId)
    .then((user) => {
      if(!user) {
        return req.session.regenerate(() => {
          req.flash('danger', 'You must be logged in');
          return res.redirect('/login');
        });
      }

      req.session.userId = user.id;
      res.locals.currentUser = user;
      res.locals.isAuthenticated = true;
      req.currentUser = user;
      next();
    });

}

module.exports = authentication;
