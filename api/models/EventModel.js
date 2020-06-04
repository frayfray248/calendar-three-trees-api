const db = require('../../database');
const mysql = require('mysql');

const Event = (event) => {
    name = event.name;
    content = event.content;
    startDate = event.startDate;
    endDate = event.endDate;
    moreInfoUrl = event.moreInfoUrl;
    locationId = event.locationId;
    programId = event.programId;
}

Event.add = (event, result) => {

    const sql = `INSERT INTO Events (Event_Name, Event_Content, Event_Start, Event_End, Event_MoreInfoURL, Location_ID, Program_ID)
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `
    const values = [
        event.name,
        event.content,
        event.startDate,
        event.endDate,
        event.moreInfoUrl,
        event.locationId,
        event.programId
    ]

    db.query(sql, values, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log("events: ", res);
            result(null, res);
        }
    });
};

Event.getAll = (result) => {
    db.query("Select * FROM Events", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            console.log('events: ', res);
            result(null, res);
        }
    });
};

Event.getAllByGroupId = (groupdId, result) => {
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
Event.search = (groupdId, tags, dates, dateRange, result) => {
    
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

module.exports = Event;