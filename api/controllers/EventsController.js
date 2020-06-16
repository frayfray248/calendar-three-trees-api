const db = require('../../database');
const Sequelize = require('sequelize');
const { Event, Location, Tag, EventTag, EventLocation, LocationEvents, EventTags, TagEvents } = require('../models/Models');


// add a single event 
exports.addEvent = (req, res, next) => {
    (async () => {

        // begining transaction
        const transaction = await db.transaction();

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

            //commit transaction
            await transaction.commit();

            // send response
            await res.status(201).send({
                event: savedEvent,
                location: savedLocation,
                tags: savedTags
            });

        } catch (err) {

            // roll back transaction
            await transaction.rollback();

            
            await res.status(500).send('Internal server error');
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

        // begining transaction
        const transaction = await db.transaction();

        try {

            // getting event to be deleted
            const event = await Event.findByPk(req.params.eventId);

            // throw error if not found
            if (!event) throw new Error('event not found');

            // finding eventTags related to event (if any)
            const eventTags = await EventTag.findAll({
                where: {
                    eventId: event.id,
                }
            });

            // deleting eventTags related to event (if any)
            for (var i = 0; i < eventTags.length; i++) {
                await eventTags[i].destroy();
            }

            // deleting event
            await event.destroy();

            //commit transaction
            await transaction.commit();

            res.status(204).send('Successful delete');
        } catch (err) {

            // roll back transaction
            await transaction.rollback();

            // event not found response
            if (err.message === 'event not found') {
                res.status(404).send('event not found');
            }
            // server error response
            else res.status(500).send('Internal server error');
        }
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