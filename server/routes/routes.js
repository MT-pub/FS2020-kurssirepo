const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const multer = require('multer')

const router = express.Router()


var storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, './files')
  },


  filename: function (req, file, cb) {

    let filename = 'testfile.jpeg';
     req.body.file = filename

    cb(null, filename)
  }
})

var upload = multer({ storage: storage })

//var upload = multer({ dest:'files/' })

router.post('/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Rekisteröityminen onnistui',
      user: req.user.email
    })
  }
)

router.post('/upload', upload.single('file'), function (req, res) {
  /* if (!req.body.files || Object.keys(req.body.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  } */

  console.log("req.body: ", req.body)
  console.log("req.body.file: ",req.body.file)
  console.log("req.body.path: ",req.body.path)
  console.log("req.file: ",req.file)
  //console.log("req.file.size: ",req.file.size)

  if (!req.body.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let newFile = req.file;
  let tmpPath = req.body.file.path

  console.log(newFile)
  //let date = Date.now().toString();
  let filePath = 'files/testfile.jpeg'

  /* fs.rename(tmpPath, filePath, function (err) {
    if (err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).send('Tiedosto vastaanotettu')
    }
  }) */
  /* newFile.mv(filePath, function (err) {
   if (err) {
     return res.status(500).send(err)
   } else {
     return res.status(200).send('Tiedosto vastaanotettu')
   }
 }); */
  console.log("hereweare")
});

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login', { session: false, successRedirect: '/', failureRedirect: '/login' },
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