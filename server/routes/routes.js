const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Rekisteröityminen onnistui',
      user: req.user.email
    })
  }
)

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login', { session: false, successRedirect:'/', failureRedirect:'/login'},
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              
              res.set('Authorization', 'Bearer ' + token)
              return res.redirect(200, '/');
              //return res.json(token)
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);





module.exports = router