// express imports
const express = require('express');
const router = express.Router();

// database imports
const db = require('../../database');
const { Organization } = require('../models/Models');

// POST endpoint for license verification
router.post('/license', (req, res, next) => {
    (async () => {

        const transaction = await db.transaction();

        try {
            // getting license key and requested transport token
            const licenseKey = req.headers.licensekey;
            const z = req.body.z;
            
            // throwing errors if license or token wasn't provided
            if (!licenseKey) throw new Error('No license');
            if (!z || isNaN(z) || z.length != process.env.TOKEN_LENGTH) throw new Error('bad request');


            // finding an organization with a matching license key
            const org = await Organization.findOne({
                where: { licenseKey: licenseKey },
                transaction: transaction
            });

            // if an organization was found, proceed to the endpoints. Else, throw an error
            if (!org) {
                throw new Error('Invalid license')
            } else {

                org.transportToken = z;
                await org.save({ transaction: transaction });

                await transaction.commit()

                await res.status(200).json(
                    {
                        message: `${org.name} license key verified`,
                        z: org.transportToken
                    });
            }

        } catch (err) {

            await transaction.rollback();

            console.log(err);

            // error responses
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