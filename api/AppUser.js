const express = require('express');
const router = express.Router();

const User = require('./../models/AppUser');

const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let { nickname, 
          email, 
          password, 
          tags = [
            { "word": "#happy" },
            { "word": "#friend" }
        ], 
          diary = []
        } = req.body;
    nickname = nickname.trim();
    email = email.trim();
    password = password.trim();
    

    if (nickname === "" || email === "" || password === "" ) {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else if (!/^[a-zA-Z]*$/.test(nickname)) {
        res.json({
            status: "FAILED",
            message: "Invalid nickname entered"
        });
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if(password.length < 8){
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        });
    } else {
        // Checking if user already exists
        User.find({ email }).then(result => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                });
            } else {
                // Try to create a new user

                // Password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        nickname,
                        email,
                        password: hashedPassword,
                        tags,
                        diary: diary || [] // Default to an empty array if diary entries are not provided
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result,
                        });
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while saving the user account!"
                        });
                    });
                })
                .catch(err => {
                    console.error('Error occured while hasing the password:', err);
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing the password!"
                    });
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for an existing user!"
            });
        });
    }
});

router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
  
    if (email === '' || password === '') {
      res.json({
        status: 'FAILED',
        message: 'Empty credentials supplied',
      });
    } else {
      User.find({ email })
        .then((data) => {
          if (data.length) {
            // User exists
  
            const hashedPassword = data[0].password;
            bcrypt
              .compare(password, hashedPassword)
              .then((result) => {
                if (result) {
                  // Password is correct, return user data
                  const user = {
                    _id: data[0]._id,
                    nickname: data[0].nickname,
                    email: data[0].email,
                    tags: data[0].tags,
                    diary: data[0].diary,
                  };
  
                  res.json({
                    status: 'SUCCESS',
                    message: 'Signin successful',
                    data: user,
                  });
                } else {
                  res.json({
                    status: 'FAILED',
                    message: 'Invalid password entered',
                  });
                }
              })
              .catch((err) => {
                res.json({
                  status: 'FAILED',
                  message: 'An error occurred while comparing passwords',
                });
              });
          } else {
            res.json({
              status: 'FAILED',
              message: 'Invalid credentials entered!',
            });
          }
        })
        .catch((err) => {
          res.json({
            status: 'FAILED',
            message: 'An error occurred while checking for an existing user',
          });
        });
    }
});

router.post('/getdata', (req, res) => {
    const {userId} = req.body;
  
    User.findById(userId)
      .then((user) => {
        if (!user) {
          res.json({
            status: 'FAILED',
            message: 'User not found',
          });
        } else {
          res.json({
            status: 'SUCCESS',
            message: 'User data retrieved successfully',
            data: user,
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

module.exports = router;