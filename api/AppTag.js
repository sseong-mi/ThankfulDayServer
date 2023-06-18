// api/tag.js
const express = require('express');
const router = express.Router();

const User = require('../models/AppUser');

// Add a new tag to the user's tags array
router.post('/add', (req, res) => {
  const { userId, tag } = req.body;

  User.findById(userId)
    .then((user) => {
      if (user) {
        // Add the new tag to the user's tags array
        user.tags.push({ word: tag });
        user
          .save()
          .then((result) => {
            res.json({
              status: 'SUCCESS',
              message: 'Tag added successfully',
              data: result.tags,
            });
          })
          .catch((err) => {
            console.error('Error occurred while saving the user:', err);
            res.json({
              status: 'FAILED',
              message: 'An error occurred while adding the tag',
            });
          });
      } else {
        res.json({
          status: 'FAILED',
          message: 'User not found',
        });
      }
    })
    .catch((err) => {
      console.error('Error occurred while finding the user:', err);
      res.json({
        status: 'FAILED',
        message: 'An error occurred while finding the user',
      });
    });
});

module.exports = router;


// Update an existing tag
router.put('/update', (req, res) => {
  const { userId, tagId, newWord } = req.body;

  User.findById(userId)
    .then((user) => {
      if (user) {
        // Find the tag with the provided tagId and update its word
        const tag = user.tags.id(tagId);
        if (tag) {
          tag.word = newWord;
          user
            .save()
            .then((result) => {
              res.json({
                status: 'SUCCESS',
                message: 'Tag updated successfully',
                data: result.tags,
              });
            })
            .catch((err) => {
              console.error('Error occurred while saving the user:', err);
              res.json({
                status: 'FAILED',
                message: 'An error occurred while updating the tag',
              });
            });
        } else {
          res.json({
            status: 'FAILED',
            message: 'Tag not found',
          });
        }
      } else {
        res.json({
          status: 'FAILED',
          message: 'User not found',
        });
      }
    })
    .catch((err) => {
      console.error('Error occurred while finding the user:', err);
      res.json({
        status: 'FAILED',
        message: 'An error occurred while finding the user',
      });
    });
});

// Delete an existing tag
router.delete('/delete', (req, res) => {
  const { userId, tagId } = req.body;

  User.findById(userId)
    .then((user) => {
      if (user) {
        // Find the tag with the provided tagId and remove it from the user's tags array
        user.tags = user.tags.filter((tag) => tag.word !== tagId);

        user
          .save()
          .then((result) => {
            res.json({
              status: 'SUCCESS',
              message: 'Tag deleted successfully',
              data: result.tags,
            });
          })
          .catch((err) => {
            console.error('Error occurred while saving the user:', err);
            res.json({
              status: 'FAILED',
              message: 'An error occurred while deleting the tag',
            });
          });
      } else {
        res.json({
          status: 'FAILED',
          message: 'User not found',
        });
      }
    })
    .catch((err) => {
      console.error('Error occurred while finding the user:', err);
      res.json({
        status: 'FAILED',
        message: 'An error occurred while finding the user',
      });
    });
});

module.exports = router;
