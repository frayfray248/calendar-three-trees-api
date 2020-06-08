const db = require('../../database');
const mysql = require('mysql');

const Event = function (event) {
    this.name = event.name;
    this.content = event.content;
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.moreInfoUrl = event.moreInfoUrl;
};

Event.add = (event, result) => {

}

Event.addLocation = (event, location) => {
    event.locationId = location.locationId;
};

module.exports = Event;