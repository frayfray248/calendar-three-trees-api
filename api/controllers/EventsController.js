const db = require('../../database');
const Sequelize = require('sequelize');
const { Op, ValidationError } = Sequelize;
const { Event, Location, Tag, EventTag, EventContact, Contact} = require('../models/Models');


// add a single event 
exports.addEvent = (req, res, next) => {
    (async () => {

        // begining transaction
        const transaction = await db.transaction();

        try {

            const locationId = req.body.location.id;

            //save or retrieve location
            const savedLocation = await (async (locationId) => {
                // if the provided location id is greater than 0,
                // then the event to be added with use that location id
                // as its location
                if (locationId > 0) { 
                    return await Location.findByPk(locationId);
                } else {
                    const newLocation = Location.build(
                        { ...req.body.location });
                    return await newLocation.save({transaction: transaction});
                }
            })(locationId);

            //create event
            const newEvent = Event.build(
                {
                    ...req.body.event,
                    programId: req.groupId,
                    locationId: savedLocation.id
                });

            const savedEvent = await newEvent.save({transaction: transaction});

            // create tags
            const savedTags = await Promise.all(req.body.tags.map(async (tag) => {
                const savedTag = await Tag.findOrCreate({ where: { name: tag }, transaction: transaction });
                await EventTag.create({ eventId: savedEvent.id, tagId: savedTag[0].id }, { fields: ['eventId', 'tagId'], transaction: transaction })
                    .catch((err) => {
                        console.log(err);
                    });
                return savedTag[0].name;
            }));

            // create contacts
            const savedContacts = await Promise.all(req.body.contacts.map(async (contact) => {
                const savedContact = await (async (contact) => {
                    if (contact.id > 0) { 
                        return await Contact.findByPk(contact.id);
                    } else {
                        const { id, ...contactBody} = contact;
                        const newContact = await Contact.build(
                            { 
                                ...contactBody
                            });
                        return await newContact.save({transaction: transaction});
                    }
                })(contact);

                await EventContact.create(
                    {eventId: savedEvent.id, contactId: savedContact.id},
                    {fields: ['eventId', 'contactId'],
                    transaction: transaction });

                return savedContact;
            }));

            //commit transaction
            await transaction.commit();

            // send response
            await res.status(201).send({
                event: savedEvent,
                location: savedLocation,
                contacts: savedContacts,
                tags: savedTags
            });

        } catch (err) {

            // roll back transaction
            await transaction.rollback();

            console.log(err);

            if (err instanceof ValidationError) {
                await res.status(400).send('Bad or malformed request');
            } else {
                await res.status(500).send('Internal server error');
            }
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
                    },
                    {
                        model: Contact,
                        as: 'contacts'
                    }
                ],
                transaction: transaction
            });

            // throw error if not found
            if (!events || events.length <= 0) throw new Error('events not found');

            // format the events
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
                    contacts: event.contacts.map((contact) => {
                        return {
                            id: contact.id,
                            name: contact.name,
                            email: contact.email,
                            phoneNumber: contact.phoneNumber
                        }
                    }),
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
            const event = await Event.findByPk(req.params.eventId, {transaction: transaction});

            // throw error if not found
            if (!event) throw new Error('event not found');

            // finding eventTags related to event (if any)
            const eventTags = await EventTag.findAll({
                where: {
                    eventId: event.id,
                },
                transaction: transaction
            });

            // finding eventContacts related to event (if any)
            const eventContacts = await EventContact.findAll({
                where: {
                    eventId: event.id,
                },
                transaction: transaction
            });

            // deleting eventTags related to event (if any)
            for (var i = 0; i < eventTags.length; i++) {
                await eventTags[i].destroy({transaction: transaction});
            }

            // deleting eventContacts related to event (if any)
            for (var i = 0; i < eventContacts.length; i++) {
                await eventContacts[i].destroy({transaction: transaction});
            }

            // deleting event
            await event.destroy({transaction: transaction});

            //commit transaction
            await transaction.commit();

            res.status(204).send();
        } catch (err) {

            console.log(err);

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