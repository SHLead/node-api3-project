const express = require('express');

const router = express.Router();
const User = require('./userDb');
const Post = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  User.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json({ message: 'error adding user' }));
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };

  Post.insert(postInfo)
    .then(user => res.status(201).json(user))
    .catch(error => res.status(500).json({ message: 'error adding post' }));
});

router.get('/', (req, res) => {
  User.get()
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json({ message: "can't retrieve users" }));
});

router.get('/:id', validateUserId, (req, res) => {
  User.getById(req.params.id)
    .then(user =>
      user
        ? res.status(200).json(user)
        : res.status(404).json({ message: 'user not found' })
    )
    .catch(err => res.status(500).json({ message: 'error retrieving user' }));
});

router.get('/:id/posts', validateUserId, (req, res) => {
  User.getUserPosts(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({ message: 'error retrieving data' }));
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
    .then(user =>
      user > 0
        ? res.status(200).json({ message: 'this user has been deleted' })
        : res.status(404).json({ message: "user doesn't exist" })
    )
    .catch(err => res.status(500).json({ message: 'error removing the user' }));
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  User.update(req.params.id, req.body)
    .then(user => res.status(201).json({ message: 'update success' }))
    .catch(err => res.status(500).json({ message: 'error updating user' }));
});

//custom middleware
function validateUserId(req, res, next) {
  const { id } = req.params;

  User.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: 'id not found' });
    }
  });
}

function validateUser(req, res, next) {
  let { name } = req.body;

  name
    ? next()
    : res.status(400).json({ message: 'missing required name field' });
}

function validatePost(req, res, next) {
  const { text } = req.body;

  text
    ? next()
    : res.status(400).json({ message: 'missing required text field' });
}

module.exports = router;
