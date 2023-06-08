const express = require("express");
const router = express.Router();
const session = require('express-session');
const Controller = require("../controllers/controller");


router.use(session({
    secret: 'ini session amazonk',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        sameSite: true 
    }
}))

const isLogin = (req, res, next) => {
    console.log(req.session)
    if (!req.session.userId) {
        const error = 'Login First!'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

const isAdmin = (req, res, next) => {
      console.log(req.session)
      if (req.session.userId && req.session.role !== 'admin') {
          const error = `You aren't allowed here!`
          res.redirect(`/login?error=${error}`)
        } else {
            next()
        }
 }


router.get('/register', Controller.renderRegister)

router.post('/register', Controller.handlerRegister)

router.get('/login', Controller.renderLogin)

router.post('/login', Controller.handlerLogin)

router.use("/admins", isAdmin, require("./admins"));
router.use("/customers", isLogin, require("./customers"));
    
module.exports = router;
    