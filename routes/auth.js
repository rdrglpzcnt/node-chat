const express = require('express');
const router = express.Router();
const AuthController = require('../bin/Controllers/AuthController.js');
  
/* GET login page. */
router.get('/login', function(req, res, next) {
  return res.render('auth/login');
});

/* POST login. */
router.post('/login', async (req, res, next) => {
  await AuthController.login(req, res, next);
});


/* GET logout. */
router.get('/logout', async (req, res, next) => {
  await AuthController.logout(req, res, next);
});


/* GET regiter page. */
router.get('/register', (req, res, next) => {
  return res.render('auth/register');
});

/* POST register */
router.post('/register', async (req, res, next) => {
  await AuthController.register(req, res, next);
})



module.exports = router;
