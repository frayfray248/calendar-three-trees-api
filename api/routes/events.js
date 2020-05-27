const express = require('express');
const router = express.Router();
const database = require('../../database');
const EventsController = require('../controllers/EventsController');

// add an event 
router.post('/', EventsController.addEvent);

// get all events
router.get('/', (req, res, next) => {
    const eventId = req.params.eventId; 
    const groupId = req.groupId;

    res.status(200).json({
        message: `Handling GET requests to groups/${groupId}/events/`
    });
});

// delete an event
router.delete('/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;
    const groupId = req.groupId;

    res.status(200).json({
        message: `Handling DELETE requests to groups/${groupId}/events/${eventId}`
    });
});


// put an event (update)
router.put('/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;
    const groupId = req.groupId;

    res.status(200).json({
        message: `Handling PUT requests to groups/${groupId}/events/${eventId}`
    });
});

// get an event
router.get('/:eventId', (req, res, next) => {
    const eventId = req.params.eventId;
    const groupId = req.groupId;

    res.status(200).json({
        message: `Handling PUT requests to groups/${groupId}/events/${eventId}`
    });
});

module.exports = router;