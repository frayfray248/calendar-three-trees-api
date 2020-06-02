const db = require('../../database');

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
    db.query(
    `
    INSERT INTO \`Events\`(
        \`Event_Name\`,
        \`Event_Content\`,
        \`Event_Start\`,
        \`Event_End\`,
        \`Event_MoreInfoURL\`,
        \`Program_ID\`
    )
    VALUES(
        ${event.name},
        ${event.content},
        ${event.startDate},
        ${event.endDate},
        ${event.moreInfoUrl},
        ${event.locationId},
        ${event.programId}
    )
    `
    , (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            console.log('events: ', res);
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

    tags = tags.split(",");
    tags = tags.map((a) => { return "'" + a + "'"}).join();
    console.log(tags);

    db.query(`
    SELECT
        e.Event_Name,
        t.Tag_Name
    FROM
        \`Events\` e
    JOIN \`Event Tags\` et ON
        et.Event_ID = e.Event_ID
    JOIN Tags t ON
        t.Tag_ID = et.Tag_ID
    WHERE t.Tag_NAME IN (${tags})
    AND e.Program_ID = ${groupdId}
    ;
    `,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('events: ', res);
                result(null, res);
            }
        });
};

module.exports = Event;