const db = require('../../database');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
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

        // begining transaction
        const transaction = await db.transaction();

        try {

            // building sequelize query where option to search tag names
            const tagsWhereOption = ((ts) => {
                if (!ts) return {};
                try {
                    return { where: { name: JSON.parse(ts) } };
                } catch (err) {
                    throw new Error('bad query');
                }
            })(req.query.tagSearch);

            // building sequelize query where option to search event content
            const contentTermsWhereOption = ((c) => {
                if (!c) return {};
                try {
                    return { content: { [Op.substring]: JSON.parse(c) } };
                } catch (err) {
                    throw new Error('bad query');
                }
            })(req.query.contentSearchTerms);

            // building sequelize query where option to search for events with dates between
            // two dates
            const dateRangeWhereOption = ((dr) => {
                if (!dr) return {};
                try {
                    return {
                        [Op.or]: {
                            startDate: { [Op.between]: [JSON.parse(dr)[0], JSON.parse(dr)[1]] },
                            endDate: { [Op.between]: [JSON.parse(dr)[0], JSON.parse(dr)[1]] }
                        }
                    }
                } catch (err) {
                    throw new Error('bad query')
                }
            })(req.query.dateRange);

            // building sequelize query where option to search for events with dates matching 
            // any date in an array of dates
            const datesWhereOption = ((d) => {
                if (!d) return {};
                try {
                    return {
                        [Op.or]: {
                            startDate: JSON.parse(d),
                            endDate: JSON.parse(d),
                        }
                    }
                } catch (err) {
                    throw new Error('bad query')
                }
            })(req.query.dates);

            const events = await Event.findAll({
                where: {
                    programId: req.groupId,
                    ...contentTermsWhereOption,
                    ...dateRangeWhereOption,
                    ...datesWhereOption
                },
                include: [
                    {
                        model: Location,
                        as: 'location'
                    },
                    {
                        model: Tag,
                        as: 'tags',
                        ...tagsWhereOption
                    }
                ]
            });

            // throw error if not found
            if (!events || events.length <= 0) throw new Error('events not found');

            const formatedEvents = events.map((event) => {

                return {
                    event: {
                        id: event.id,
                        name: event.name,
                        content: event.content,
                        startDate: event.startDate,
                        endDate: event.endDate,
                        moreInfoUrl: event.moreInfoUrl
                    },
                    location: {
                        locationId: event.location.id,
                        name: event.location.name,
                        address: event.location.address,
                        postalCode: event.location.postalCode
                    },
                    tags: event.tags.map(tag => tag.name)
                }
            });

            //commit transaction
            await transaction.commit();

            await res.status(200).send({
                events: formatedEvents
            });

        } catch (err) {

            await transaction.rollback();

            // event not found response
            if (err.message === 'events not found') {
                res.status(404).send('events not found');
            } else if (err.message === 'bad query') {
                res.status(400).send('bad query');
            }
            else {
                await res.status(500).send('Internal server error');
            }
            console.log(err);

        }
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

        const transaction = await db.transaction();

        try {

            //save or retrieve location
            const newLocation = await (async (locationId) => {
                if (locationId > 0) {
                    return await Location.findByPk(locationId);
                } else {
                    const newLocation = Location.build(
                        { ...req.body.location });
                    return await newLocation.save();
                }
            })(req.body.location.locationId);

            // getting event to be updated
            const event = await Event.findByPk(req.params.eventId,
                {
                    where: {programId: req.param.groupId}
                });

            // throw error if not found
            if (!event) throw new Error('event not found');

            // updating event
            const updatedEvent = await event.update({
                ...req.body.event,
                locationId: newLocation.id,
                programId: req.params.groupId,
            });

            const tags = req.body.tags;

            // updating tags
            for (var i = 0; i < tags.length; i++) {
                const tag = await Tag.findOrCreate({ where: { name: tags[i] }});
                await EventTag.findOrCreate({
                    where: {
                        eventId: updatedEvent.id,
                        tagId: tag[0].id,
                        transaction: transaction
                    }
                })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            await transaction.commit();
            res.status(204).send();

        } catch (err) {

            await transaction.rollback();

            if (err.message === 'event not found') {
                res.status(404).send('Event not found');
            } else {
                res.status(500).send('Internal server error');
            }

            console.log(err);
        }
    })();
}

// get a single event by event id and group id
exports.getEvent = (req, res, next) => {
    (async () => {

        const transaction = await db.transaction();

        try {

            const eventId = req.params.eventId;

            const event = await Event.findByPk(eventId,
                {
                    where: {
                        programId: req.groupId,
                    },
                    include: [
                        {
                            model: Location,
                            as: 'location'
                        },
                        {
                            model: Tag,
                            as: 'tags',
                        }
                    ]
                });

            // throw error if not found
            if (!event) throw new Error('event not found');

            const formatedEvent = {
                event: {
                    id: event.id,
                    name: event.name,
                    content: event.content,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    moreInfoUrl: event.moreInfoUrl
                },
                location: {
                    locationId: event.location.id,
                    name: event.location.name,
                    address: event.location.address,
                    postalCode: event.location.postalCode
                },
                tags: event.tags.map(tag => tag.name)
            };

            await transaction.commit();

            await res.status(200).send({
                event: formatedEvent
            });

        } catch (err) {
            await transaction.rollback();

            if (err.message === 'event not found') {
                res.status(404).send('Event not found');
            } else {

                res.status(500).send('Internal server error');
            }

            console.log(err);
        }



    })();
}