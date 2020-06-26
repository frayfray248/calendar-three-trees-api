const express = require('express');
const router = express.Router();
const events = require('./events');
const checkAuth = require('../middleware/check-auth');


// reroute the request to events endpoint
router.use('/:groupId/events', checkAuth, (req, res, next) => {
    req.groupId = req.params.groupId;
    next();
}, events);

module.exports = router;