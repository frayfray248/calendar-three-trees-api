const db = require('../../database');

const Event = (event) => {
    name = event.name;
    content = event.content;
    startDate = event.startDate;
    endDate = event.endDate;
    moreInfoUrl = event.moreInfoUrl;
}

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

Event.search = (groupdId, tags, dates, dateRange, result) => {

    tags = tags.split(",");
    tags = tags.map((a) => { return "'" + a + "'"}).join();
    console.log(tags);

    db.query(`
    SELECT
        e.Event_NAme,
        t.Tag_Name
    FROM
        \`Events\` e
    JOIN \`Event Tags\` et ON
        et.Event_ID = e.Event_ID
    JOIN Tags t ON
        t.Tag_ID = et.Tag_ID
    WHERE t.Tag_NAME IN (${tags})
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