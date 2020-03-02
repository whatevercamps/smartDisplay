const express = require("express");
const router = express.Router();
const config = require("../config/database");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const Image = require("../models/image");
var shell = require("shelljs");
var Jimp = require("jimp");
//............subir methods.........
//hola como estas desde el pasado
// Set The Storage Engine
const DIR = "./smartDisplay/public/assets/img/";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
let upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("photo");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Por favor seleccione una imagen correcta!");
  }
}

//...........fin subir methods

// Register
router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({
        success: false,
        msg: "Fallo al registrar usuario"
      });
    } else {
      res.json({
        success: true,
        msg: "Usuario registrado"
      });
    }
  });
});

// Authenticate
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: "Usuario incorrecto"
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 1200 //20 minutos
        });

        res.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({
          success: false,
          msg: "Clave incorrecta"
        });
      }
    });
  });
});

//verFotos
router.get("/images", (req, res, next) => {
  Image.getImages((err, images) => {
    if (err) throw err;

    if (!images) {
      return res.json({
        success: false,
        msg: "Error obteniendo imagenes"
      });
    } else {
      res.json({
        imgs: images
      });
    }
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res, next) => {
    res.json({
      user: req.user
    });
  }
);

// Validate
router.post("/validate", (req, res, next) => {
  res.send("VALIDATE");
});

router.delete("/removeImage", (req, res, next) => {
  Image.findByIdAndDelete(req.query.idImage, (err, resp) => {
    if (err) {
      console.log(err);
      throw err;
    }
    //shell.exec('sh sc.sh');
    res.json({
      success: true,
      response: resp
    });
  });
});

//subir fotos
router.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({
        success: false,
        idS: 100,
        msg: err
      });
    } else {
      if (req.file == undefined) {
        return res.json({
          success: false,
          idS: 400,
          msg: "No hay archivo"
        });
      } else {
        Jimp.read(DIR + req.file.filename, (err, image) => {
          if (err) {
            console.log("1." + err);
            return res.json({
              success: false,
              idS: 100,
              msg: err
            });
          }

          image.resize(600, 315, (err, image) => {
            if (err) {
              console.log("2." + err);
              return res.json({
                success: false,
                idS: 100,
                msg: err
              });
            }

            image.quality(50, (err, image) => {
              if (err) {
                console.log("3." + err);
                return res.json({
                  success: false,
                  idS: 100,
                  msg: err
                });
              }

              image.write(DIR + "thumbnail/" + req.file.filename, err => {
                if (err) {
                  console.log("4." + err);
                  return res.json({
                    success: false,
                    idS: 100,
                    msg: err
                  });
                }

                let newImage = new Image({
                  img: "assets/img/" + req.file.filename,
                  imgThumbnail: "assets/img/thumbnail/" + req.file.filename,
                  alt: " ",
                  text: " ",
                  hashName: req.file.filename
                });

                console.log(newImage);

                Image.addImage(newImage, (err, image) => {
                  if (err) {
                    console.log("5." + err);
                    res.json({
                      success: false,
                      msg:
                        "Fallo al registrar imagen en la base de datos: " + err
                    });
                  } else {
                    //shell.exec('sh sc.sh');
                    console.log("holaaa");
                    res.json({
                      success: true,
                      msg: "File Uploaded!",
                      idS: 200,
                      file: `uploads/${req.file.filename}`
                    });
                  }
                });
              });
            });
          });
        });
      }
    }
  });
});

module.exports = router;
