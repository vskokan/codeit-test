const router = require('express').Router();
const countries = require('./../controllers/countries')
const users = require('./../controllers/users')

router.get('/countries', countries.readCountries)
router.get('/users/:login/check', users.checkLoginForExistence)
router.post('/users/email/check', users.checkEmailForExistence)
router.post('/users', users.createUser)
router.get('/users/:login', users.readOneUser)
router.post('/login', users.signIn)

module.exports = router;