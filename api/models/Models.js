const Event = require('../models/EventModel');
const Location = require('../models/LocationModel');
const Tag = require('../models/TagModel');
const EventTag = require('./EventTagModel');
const Organization = require('../models/OrganizationModel');
const OrganizationProgram = require('../models/OrganizationProgramsModel')
const Program = require('../models/ProgramModel');

// associations
exports.EventLocation = Event.belongsTo(Location, { foreignKey: 'Location_ID', as: 'location' });
exports.EventTags = Event.belongsToMany(Tag, { through: 'EventTag', foreignKey: 'Event_ID', as: 'tags' });
exports.TagEvents = Tag.belongsToMany(Event, { through: 'EventTag', foreignKey: 'Tag_ID', as: 'events' });
exports.LocationEvents = Location.hasMany(Event, { foreignKey: 'Location_ID', as: 'events' });

exports.OrganizationPrograms = Organization.belongsToMany(Program, {
    through: 'OrganizationProgram', foreignKey: 'Org_ID', as: 'programs'
});
exports.ProgramOrganizations = Program.belongsToMany(Organization, {
    through: 'OrganizationProgram', foreignKey: 'Program_ID', as: 'organizations'
});

// models
exports.Event = Event;
exports.Location = Location;
exports.Tag = Tag;
exports.EventTag = EventTag;
exports.Organization = Organization;
exports.OrganizationProgram = OrganizationProgram;