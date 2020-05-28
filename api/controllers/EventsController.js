const database = require('../../database');
const Event = require('../models/EventModel');
const Location = require('../models/LocationModel');

// add a single event 
exports.addEvent = (req, res, next) => {

    res.status(200).json({
        message: `Handling POST requests to groups/${req.groupId}/events/`,
        event: event
    });
};

/*  Get all events
*   todo: 
*       - add search functionality
*       - retrieve location and organization info
*/
exports.getEvents = (req, res, next) => {

    Promise.all([
        Event.findAll(),
        Location.findAll(),
    ]).then((data) => {
        res.status(200).json(data);
    }).catch(err => res.status(500).json(err));
}

// delete one event by event id and group id
exports.deleteEvent = (req, res, next) => {

    res.status(200).json({
        message: `Handling DELETE requests to groups/${req.groupId}/events/${req.params.eventId}`
    });
}

// update an event with a new event
exports.updateEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const groupId = req.groupId;

    res.status(200).json({
        message: `Handling PUT requests to groups/${groupId}/events/${eventId}`
    });
}

// get a single event by event id and group id
exports.getEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const groupId = req.groupId;

    res.status(200).json({
        message: `Handling PUT requests to groups/${groupId}/events/${eventId}`
    });
}