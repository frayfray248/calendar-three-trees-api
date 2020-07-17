const express = require('express');
const router = express.Router();
const events = require('./events');
const GroupsController = require('../controllers/GroupsController');
const checkAuth = require('../middleware/check-auth');


// reroute the request to events endpoint
router.use('/:groupId/events', checkAuth, (req, res, next) => {
    req.groupId = req.params.groupId;
    next();
}, events);

router.get('/', GroupsController.getGroups);

module.exports = router;