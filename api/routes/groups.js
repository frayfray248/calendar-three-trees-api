const express = require('express');
const router = express.Router();
const events = require('./events');
const checkOrgLicense = require('../middleware/check-org-license');


// reroute the request to events endpoint
router.use('/:groupId/events', checkOrgLicense, (req, res, next) => {
    req.groupId = req.params.groupId;
    next();
}, events);

module.exports = router;