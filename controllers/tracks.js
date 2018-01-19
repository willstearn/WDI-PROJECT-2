const Track = require('../models/track');

function indexRoute(req, res, next) {
  Track
    .find()
    .populate('createdBy')
    .exec()
    .then((tracks) => res.render('tracks/index', { tracks }))
    .catch(next);
}

function newRoute(req, res) {
  return res.render('tracks/new');
}

function createRoute(req, res, next) {
  req.body.createdBy = req.currentUser.id;

  Track
    .create(req.body)
    .then(() => res.redirect('/tracks'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/tracks/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

function showRoute(req, res, next) {
  Track
    .findById(req.params.id)
    .populate('createdBy')
    .exec()
    .then(track => {
      if(!track) return res.notFound();
      return res.render('tracks/show', { track });
    })
    .catch(next);
}

function editRoute(req, res, next) {
  Track
    .findById(req.params.id)
    .exec()
    .then(track => {
      if(!track) return res.redirect();
      if(!track.belongsTo(req.currentUser)) return res.unauthorized('You do not have permission to edit that resource');
      return res.render('tracks/edit', { track });
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Track
    .findById(req.params.id)
    .exec()
    .then(track => {
      if(!track) return res.notFound();
      if(!track.belongsTo(req.currentUser)) return res.unauthorized('You do not have permission to edit that resource');

      for(const field in req.body) {
        track[field] = req.body[field];
      }

      return track.save();
    })
    .then(() => res.redirect(`/tracks/${req.params.id}`))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/tracks/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

function deleteRoute(req, res, next) {
  Track
    .findById(req.params.id)
    .exec()
    .then(track => {
      if(!track) return res.notFound();
      if(!track.belongsTo(req.currentUser)) return res.unauthorized('You do not have permission to delete that resource');
      return track.remove();
    })
    .then(() => res.redirect('/tracks'))
    .catch(next);
}

function createCommentRoute(req, res, next) {

  Track
    .findById(req.params.id)
    .exec()
    .then(track => {
      if (!track) return res.notFound();

      req.body.createdBy = req.currentUser;
      track.comments.push(req.body); //create an embedded record

      return track.save();
    })
    .then(() => res.redirect(`/tracks/${req.params.id}`))
    .catch((err) => {
      if (err.name === 'ValidationError') res.badRequest(`/tracks/${req.params.id}`, err.toString());
      next(err);
    });
// or .catch(next); ????

}

function deleteCommentRoute(req, res, next) {
  Track
    .findById(req.params.id)
    .exec()
    .then(track => {
      if (!track) return res.notFound();
      if (!track.belongsTo(req.currentUser)) return res.unauthorized('You do not have permission to delete that resource');
      track.comments.id(req.params.commentId).remove();

      return track.save();
    })
    .then(track => res.redirect(`/tracks/${track.id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute
};
