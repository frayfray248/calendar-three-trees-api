const database = require('../../database');

exports.addEvent = (req, res, next) => {
    const event = {
        name: req.body.name,
        tags: req.body.tags,
        content: req.body.content,
        moreInfoURL: req.body.moreInfoURL,
        eventDate: req.body.eventDate,
        dateCreated: req.body.dateCreated
    };

    // database connection
    database.connect((err) => {
        if (err) throw err;
        else console.log("connected to db");
    });


    res.status(200).json({
        message: `Handling POST requests to groups/${req.groupId}/events/`,
        event: event
    });
};