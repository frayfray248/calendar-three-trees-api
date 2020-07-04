const Event = require('../models/EventModel');
const Location = require('../models/LocationModel');
const Tag = require('../models/TagModel');
const EventTag = require('./EventTagModel');
const Organization = require('../models/OrganizationModel');
const OrganizationProgram = require('../models/OrganizationProgramsModel')
const Program = require('../models/ProgramModel');
const EventContact = require('../models/EventContacts');
const Contact = require('../models/ContactModel');

// event to tag association
exports.EventLocation = Event.belongsTo(Location, { foreignKey: 'Location_ID', as: 'location' });
exports.EventTags = Event.belongsToMany(Tag, { through: 'EventTag', foreignKey: 'Event_ID', as: 'tags' });
exports.TagEvents = Tag.belongsToMany(Event, { through: 'EventTag', foreignKey: 'Tag_ID', as: 'events' });
exports.LocationEvents = Location.hasMany(Event, { foreignKey: 'Location_ID', as: 'events' });

// organization to program association
exports.OrganizationPrograms = Organization.belongsToMany(Program, {
    through: 'OrganizationProgram', foreignKey: 'Org_ID', as: 'programs'
});
exports.ProgramOrganizations = Program.belongsToMany(Organization, {
    through: 'OrganizationProgram', foreignKey: 'Program_ID', as: 'organizations'
});

// event to contact association
exports.EventContacts = Event.belongsToMany(Contact, { through: 'EventContact', foreignKey: 'Event_ID', as : 'contacts'});
exports.ContactEvents = Contact.belongsToMany(Event, { through: 'EventContact', foreignKey: 'Contact_ID', as : 'events'});



// models
exports.Event = Event;
exports.Location = Location;
exports.Tag = Tag;
exports.EventTag = EventTag;
exports.Organization = Organization;
exports.OrganizationProgram = OrganizationProgram;
exports.Contact = Contact;
exports.EventContact = EventContact;