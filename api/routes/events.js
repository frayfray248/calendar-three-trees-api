const express = require('express');
const router = express.Router();
const database = require('../../database');
const EventsController = require('../controllers/EventsController');

// add an event 
router.post('/', EventsController.addEvent);

// get all events
router.get('/', EventsController.getEvents);

// delete an event
router.delete('/:eventId', EventsController.deleteEvent);

// put an event (update)
router.put('/:eventId', EventsController.updateEvent);

// get an event
router.get('/:eventId', EventsController.getEvent);

module.exports = router;