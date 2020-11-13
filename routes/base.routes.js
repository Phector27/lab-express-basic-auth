const express = require('express')
const router = express.Router()
const app = require('../app')

// Endpoints
router.get('/', (req, res) => res.render('index'))

//MIDDLEWARE
router.use((req, res, next) => req.session.currentUser ? next() : res.render('login', { errorMsg: 'Zona restringida' }))

// PÁGINAS PRIVADAS
router.get('/main', (req, res) => res.render('main'))

router.get('/private', (req, res) => res.render('private'))


module.exports = router