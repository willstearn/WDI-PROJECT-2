const router = require('express').Router();

const registration  = require('../controllers/registration');
const session = require('../controllers/session');
const tracks = require('../controllers/tracks');
const statics = require('../controllers/statics');
const users = require('../controllers/users');
const secureRoute = require('../lib/secureRoute');

// A home route
router.route('/')
  .get(statics.index);

router.route('/register')
  .get(registration.new)
  .post(registration.create);

router.route('/login')
  .get(session.new)
  .post(session.create);

router.route('/logout')
  .get(session.delete);



// --------------------------------

router.route('/users/:id')
  .get(secureRoute, users.show)
  .put(secureRoute, users.update)
  .delete(secureRoute, users.delete);

router.route('/users/:id/edit')
  .get(secureRoute, users.edit);

// --------------------------------

router.route('/tracks')
  .get(secureRoute, tracks.index)
  .post(secureRoute, tracks.create);

router.route('/tracks/new')
  .get(secureRoute, tracks.new);

router.route('/tracks/:id')
  .get(secureRoute, tracks.show)
  .put(secureRoute, tracks.update)
  .delete(secureRoute, tracks.delete);

router.route('/tracks/:id/edit')
  .get(secureRoute, tracks.edit);

router.route('/tracks/:id/comments')
  .post(secureRoute, tracks.createComment)
  .delete(secureRoute, tracks.deleteComment);

// -----------------------------------

router.route('/users')
  .get(secureRoute, statics.index);

// DELETE
// router.all('*', (req, res) => res.notFound());

module.exports = router;
