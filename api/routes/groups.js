const express = require('express');
const router = express.Router();
const events = require('./events');


// reroute the request to events endpoint
router.use('/:groupId/events', (req, res, next) => {
    req.groupId = req.params.groupId;
    next();
}, events);

module.exports = router;