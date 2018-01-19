const Track = require('../models/track');
const User = require('../models/user');

// GET /account
function usersShow(req, res) {
  Track
    .find({ createdBy: req.params.id })
    .exec()
    .then(tracks => {
      User
        .findById(req.params.id)
        .exec()
        .then((user) => {
          res.render('users/show', { user, tracks });
        });
    });
}

// GET /user/edit
function usersEdit(req, res) {
  return res.render('users/edit', { user: req.currentUser });
}

// PUT /user
function usersUpdate(req, res, next) {
  for(const field in req.body) {
    req.currentUser[field] = req.body[field];
  }

  req.currentUser.save()
    .then(() => res.redirect('/user'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest('/users/edit', err.toString());
      next(err);
    });
}

// DELETE /track
function usersDelete(req, res, next) {
  return req.currentUser.remove()
    .then(() => {
      req.session.regenerate(() => res.redirect('/'));
    })
    .catch(next);
}

module.exports = {
  show: usersShow,
  edit: usersEdit,
  update: usersUpdate,
  delete: usersDelete
};
