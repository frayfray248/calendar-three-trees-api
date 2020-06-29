const express = require('express');
const router = express.Router();

const db = require('../../database');
const { Organization } = require('../models/Models');

// verify license
router.post('/license', (req, res, next) => {
    (async () => {

        const transaction = await db.transaction();

        try {
            const licenseKey = req.headers.licensekey;
            const z = req.body.z;

            if (!licenseKey) throw new Error('No license');
            if (!z) throw new Error('bad request');
            // finding an organization with a matching licensekey
            const org = await Organization.findOne({ where: { licenseKey: licenseKey } });

            // if an organization was found, proceed to the endpoints. Else, throw an error
            if (!org) {
                throw new Error('Invalid license')
            } else {

                org.transportToken = z;
                org.save();

                await transaction.commit()
                res.status(200).json(
                    {
                        message: `${org.name} license key verified`,
                        z : z
                    });
            }

        } catch (err) {

            await transaction.rollback();
            console.log(err);

            // invalid message error
            if (err.message === 'Invalid license') {
                res.status(401).json({ message: 'Invalid license' });
            } else if (err.message === 'No license') {
                res.status(401).json({ message: 'License required' });
            } else if (err.message === 'bad request') {
                res.status(400).json({ message: 'Bad or malformed request' });
            }
            else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    })();
});

module.exports = router;