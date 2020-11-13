const express = require('express')
const router = express.Router()

const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const User = require('./../models/user.model')
const app = require('../app')
const { route } = require('./base.routes')


// Endpoints
router.get('/registro', (req, res) => res.render('signUp'))

router.post('/registro', (req, res) => {
    
    const { username, password } = req.body

    if (!username || !password) {
        res.render('signUp', { errorMsg: 'Completa todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('signUp', { errorMsg: 'Ese nombre de usuario ya existe. Elige otro' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)


            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))

        })

})



router.get('/inicio-sesion', (req, res) => res.render('login'))

router.post('/inicio-sesion', (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('login', { errorMsg: 'Completa todos los campos' })
        return
    }

    User 
        .findOne({ username })
        .then(theUser => {

            if (!theUser) {
                res.render('login', { errorMsg: 'Usuario no encontrado' })
                return
            }

            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render('login', { errorMsg: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = theUser
            res.render('index')
        })

        .catch(err => console.log(err))
})



module.exports = router
