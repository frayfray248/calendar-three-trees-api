const db = require('../../database');
const { Organization } = require('../models/Models');

/*
This middleware is used before accessing the event end points. It takes a license key in the request 
header and compares it to one in the database. If a license key in the DB was found, then the program
will proceed to the endpoints.
*/

module.exports = (req, res, next) => {
    (async () => {
        try {

            // finding an organization with a matching licensekey
            const org = await Organization.findOne({ where: { licenseKey: req.headers.licensekey } });

            // if an organization was found, proceed to the endpoints. Else, throw an error
            if (!org) {
                throw new Error('Invalid license')
            } else {
                next();
            }
            
        } catch (err) {
            console.log(err);

            // invalid message error
            if (err.message === 'Invalid license') {
                return res.status(401).json({ message: 'Invalid license' });
            }
            else {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    })();
};