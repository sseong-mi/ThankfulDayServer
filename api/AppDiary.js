const express = require('express');
const router = express.Router();

const User = require('./../models/AppUser');

router.post('/insert', (req, res) => {
    const { userId, diaryEntry } = req.body;
    
    const date = diaryEntry.date; 
    const tagsUsed = diaryEntry.tagsUsed; 
    const time = diaryEntry.time; 
    const notes = diaryEntry.notes; 
    
    if (!date || !tagsUsed || !time) {
        const missingFields = [];
        if (!date) missingFields.push('date');
        if (!tagsUsed) missingFields.push('tagsUsed');
        if (!time) missingFields.push('time');
      
        res.json({
          status: 'FAILED',
          message: `Required fields are missing: ${missingFields.join(', ')}`,
          missingFields,
        });
        return;
    }
  
    User.findById(userId)
      .then((user) => {
        if (!user) {
          res.json({
            status: 'FAILED',
            message: 'User not found',
          });
        } else {
          const newDiaryEntry = {
            date,
            tagsUsed,
            time,
            notes,
          };
  
          user.diary.push(newDiaryEntry);
  
          user
            .save()
            .then((result) => {
              res.json({
                status: 'SUCCESS',
                message: 'Diary entry added successfully',
                data: result.diary,
              });
            })
            .catch((error) => {
              console.error('Error occurred while saving diary entry:', error);
              res.json({
                status: 'FAILED',
                message: 'An error occurred while saving the diary entry',
              });
            });
        }
      })
      .catch((error) => {
        console.error('Error occurred while finding user:', error);
        res.json({
          status: 'FAILED',
          message: 'An error occurred while finding the user',
        });
      });
});

router.put('/update', (req, res) => {
  const { userId, diaryEntryId, updatedData } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.json({
          status: 'FAILED',
          message: 'User not found',
        });
      } else {
        const diaryEntry = user.diary.id(diaryEntryId);
        if (!diaryEntry) {
          res.json({
            status: 'FAILED',
            message: 'Diary entry not found',
          });
        } else {
          // Update the diary entry with the provided data
          diaryEntry.date = updatedData.date || diaryEntry.date;
          diaryEntry.tagsUsed = updatedData.tagsUsed || diaryEntry.tagsUsed;
          diaryEntry.time = updatedData.time || diaryEntry.time;
          diaryEntry.notes = updatedData.notes || diaryEntry.notes;

          user
            .save()
            .then((result) => {
              res.json({
                status: 'SUCCESS',
                message: 'Diary entry updated successfully',
                data: result.diary,
              });
            })
            .catch((error) => {
              console.error('Error occurred while saving user:', error);
              res.json({
                status: 'FAILED',
                message: 'An error occurred while saving the user',
              });
            });
        }
      }
    })
    .catch((error) => {
      console.error('Error occurred while finding user:', error);
      res.json({
        status: 'FAILED',
        message: 'An error occurred while finding the user',
      });
    });
});

  

router.delete('/delete', (req, res) => {
    const { userId, diaryEntryId } = req.body;
  
    User.findById(userId)
      .then((user) => {
        if (!user) {
          res.json({
            status: 'FAILED',
            message: 'User not found',
          });
        } else {
          const diaryIndex = user.diary.findIndex(
            (entry) => entry._id.toString() === diaryEntryId
          );
  
          if (diaryIndex === -1) {
            res.json({
              status: 'FAILED',
              message: 'Diary entry not found',
            });
          } else {
            user.diary.splice(diaryIndex, 1);
  
            user
              .save()
              .then((result) => {
                res.json({
                  status: 'SUCCESS',
                  message: 'Diary entry deleted successfully',
                  data: result.diary,
                });
              })
              .catch((error) => {
                console.error('Error occurred while saving user:', error);
                res.json({
                  status: 'FAILED',
                  message: 'An error occurred while saving the user',
                });
              });
          }
        }
      })
      .catch((error) => {
        console.error('Error occurred while finding user:', error);
        res.json({
          status: 'FAILED',
          message: 'An error occurred while finding the user',
        });
      });
});

module.exports = router;
