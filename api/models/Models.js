const Event = require('../models/EventModel');
const Location = require('../models/LocationModel');
const Tag = require('../models/TagModel');
const EventTag = require('./EventTagModel');

// associations
exports.EventLocation = Event.belongsTo(Location, {foreignKey: 'Location_ID', as: 'location'});
exports.EventTags = Event.belongsToMany(Tag, {through: 'EventTag', foreignKey: 'Event_ID', as: 'tags'});
exports.TagEvents= Tag.belongsToMany(Event, {through: 'EventTag', foreignKey: 'Tag_ID', as: 'events'});
exports.LocationEvents = Location.hasMany(Event, {foreignKey: 'Location_ID', as: 'events'});

// models
exports.Event = Event;
exports.Location = Location;
exports.Tag = Tag;
exports.EventTag = EventTag;