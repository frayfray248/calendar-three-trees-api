const database = require('../../database');
const { Event, Location, Tag, EventTag, EventLocation, LocationEvents } = require('../models/Models');

// add a single event 
exports.addEvent = (req, res, next) => {
    (async () => {
        try {

            const locationId = req.body.location.locationId;

            //save or retrieve location
            const savedLocation = await (async (locationId) => {
                if (locationId > 0) {
                    return await Location.findByPk(locationId);
                } else {
                    const newLocation = Location.build(
                        { ...req.body.location });
                    return await newLocation.save();
                }
            })(locationId);

            //create event
            const newEvent = Event.build(
                {
                    ...req.body.event,
                    programId: req.groupId,
                    locationId: savedLocation.id
                });

            const savedEvent = await newEvent.save();

            // create tags

            const savedTags = await Promise.all(req.body.tags.map(async (tag) => {
                const savedTag = await Tag.findOrCreate({ where: { name: tag } });
                await EventTag.create({ eventId: savedEvent.id, tagId: savedTag[0].id }, { fields: ['eventId', 'tagId'] })
                    .catch((err) => {
                        console.log(err);
                    });
                return savedTag[0].name;
            }));

            // send response
            await res.status(201).send({
                event: savedEvent,
                location: savedLocation,
                tags: savedTags
            });

        } catch (err) {
            console.log(err);
            await res.status(500).send(JSON.stringify(err));
        }
    })();
};

//get all events
exports.getEvents = (req, res, next) => {
    (async () => {
        const events = Event.findAll();

        events.foreach(event => {

        });

    })();
}

// delete one event by event id and group id
exports.deleteEvent = (req, res, next) => {
    (async () => {

    })();
}

// update an event with a new event
exports.updateEvent = (req, res, next) => {
    (async () => {

    })();
}

// get a single event by event id and group id
exports.getEvent = (req, res, next) => {
    (async () => {

    })();
}