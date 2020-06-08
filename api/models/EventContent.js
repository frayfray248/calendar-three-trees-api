const db = require('../../database');
const mysql = require('mysql');
const Event = require('./EventModel');
const Location = require('./LocationModel');
const Tag = require('./../models/TagModel');

const EventContent = function (eventContent) {
    this.event = new Event(eventContent.event);
    this.location = new Location(eventContent.location);
};

EventContent.add = (eventContent, programId, result) => {
    try {
    const newEvent = new Event(eventContent.event);
    const newLocation = new Location(eventContent.location);

    const sql = `
    BEGIN;

    INSERT INTO \`Locations\` (\`Location_ID\`, \`Location_Name\`, \`Location_Address\`, \`Location_PostCode\`) 
    VALUES (NULL, ?, ?, ?);

    SET @location_id = LAST_INSERT_ID();

    INSERT INTO \`Events\` (\`Event_ID\`, \`Event_Name\`, \`Event_Content\`, \`Event_Start\`, \`Event_End\`, \`Event_MoreInfoURL\`, \`Location_ID\`, \`Program_ID\`) 
    VALUES (NULL, ?, ?, ?, ?, ?, @location_id, ?);

    SET @event_id = LAST_INSERT_ID();

    INSERT INTO \`Tags\` (\`Tag_ID\`, \`Tag_Name\`) VALUES (NULL, ?);

    SET @tag_id = LAST_INSERT_ID();

    INSERT INTO \`Event Tags\` (\`Event_ID\`, \`Tag_ID\`) VALUES (@event_id, @tag_id);

    COMMIT;
    `

    const values = [
        newLocation.name,
        newLocation.address,
        newLocation.postalCode,
        newEvent.name,
        newEvent.content,
        newEvent.startDate,
        newEvent.endDate,
        newEvent.moreInfoUrl,
        programId.toString(),
        eventContent.tags[0]
    ];

    db.query(sql, values, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log("events: ", res);
            result(null, res);
        }
    });
} catch(e) {
    console.log("SERVER ERROR: ", e);
}
}

EventContent.getAll = (result) => {
    db.query("Select * FROM Events", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('events: ', res);
            result(null, res);
        }
    });
};

EventContent.getAllByGroupId = (groupdId, result) => {
    db.query(`Select * FROM Events WHERE Program_ID = ${groupdId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            console.log('events: ', res);
            result(null, res);
        }
    });
};


// todo:
// !!database doesn't have event dates!!
EventContent.search = (groupdId, tags, dates, dateRange, result) => {

    var params = [groupdId];
    console.log(dates);

    var statement = `
    SELECT
        *
    FROM
        \`Events\` e
    JOIN \`Event Tags\` et ON
        et.Event_ID = e.Event_ID
    JOIN Tags t ON
        t.Tag_ID = et.Tag_ID
    JOIN Locations l ON
        e.Location_ID = l.Location_ID
    WHERE e.Program_ID = ? 
    AND `
        ;

    var paramStatements = [];

    if (tags != null) {
        paramStatements.push(`t.Tag_Name IN (?) `);
        params.push(tags.split(","));
    }

    if (dates != null) {
        paramStatements.push(`e.Event_Start IN (?)`);
        params.push(dates.split(","));
    }

    if (paramStatements.length > 1) {
        statement += paramStatements.join(" AND ");
    } else {
        statement += paramStatements;
    }

    statement += ";";

    console.log(statement);

    const query = mysql.format(statement, params);

    db.query(query,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log('events: ', res);
                result(null, res);
            }
        });
};

module.exports = EventContent;