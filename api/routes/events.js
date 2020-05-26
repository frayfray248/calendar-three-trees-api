const express = require('express');
const router = express.Router();

router.post('/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;
    const groupId = req.groupId;

    res.status(200).json({
        message: `Handling POST requests to groups/${groupId}/events/${eventId}`
    });
});

module.exports = router;