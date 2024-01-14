const express = require('express');

const {Router} = express;
const router = new Router();

const user = require('./controllers/Users/UserContoller');

router.use('/', user);

module.exports = router;
