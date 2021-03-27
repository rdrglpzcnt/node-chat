const express = require('express');
const router = express.Router();
const ChatController = require('../bin/Controllers/ChatController.js')

/* Chat Auth Middlerawe */
router.use( async (req, res, next) => {
	await ChatController.middleware(req, res, next);
});

router.get('/', async (req, res, next) => {
	await ChatController.index(req, res, next);
});

module.exports = router;
