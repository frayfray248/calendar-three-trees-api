const db = require('../../database');
const mysql = require('mysql');

const Location = function (location) {
    this.name = location.name,
    this.address = location.address,
    this.postalCode = location.postalCode
};

Location.add = (location, result) => {
    const sql = `
        INSERT INTO Locations (
        Location_Name,
        Location_Address,
        Location_PostCode)
     VALUES(?, ?, ?); 
     `
    var values = [
        location.name,
        location.address,
        location.postalCode
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
};

module.exports = Location;