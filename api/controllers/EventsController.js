const database = require('../../database');
const Event = require('../models/EventModel');

exports.addEvent = (req, res, next) => {

    res.status(200).json({
        message: `Handling POST requests to groups/${req.groupId}/events/`,
        event: event
    });
};

exports.getEvents = (req, res, next) => {

    Event.findAll()
        .then(Events => {
            res.status(200).json(Events);
        })
        .catch(err=> console.log(err));

    
}