const database = require('../../database');
const EventContent = require('../models/EventContent');

// add a single event 
exports.addEvent = (req, res, next) => {

    EventContent.add(req.body, req.groupId, (err, event) => {
        if (err) res.status(400).send("Bad or malformed request");
        else res.status(200).json(JSON.stringify(event));
    });
};

/*  Get all events
*   todo: 
*       - add search functionality
*       - retrieve location and organization info
*/
exports.getEvents = (req, res, next) => {

    if (Object.keys(req.query).length === 0) {
        EventContent.getAll((err, event) => {
            if (err) res.status(400).send("Bad or malformed request");
            else res.status(200).json(event);
        });
    } else {
        Eventt.search(req.groupId, req.query.tags, req.query.dates, req.query.dateRange, (err, event) => {
            if (err) res.status(400).send("Bad or malformed request");
            else res.status(200).json(event);
        });
    }
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