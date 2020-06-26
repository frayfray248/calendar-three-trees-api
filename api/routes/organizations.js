const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require('../../database');
const { Organization } = require('../models/Models');

// verify license
router.post('/license', (req, res, next) => {
    (async () => {

        const transaction = await db.transaction();

        try {
            const licenseKey = req.headers.licensekey;

            if (!licenseKey) throw new Error('No license');
            // finding an organization with a matching licensekey
            const org = await Organization.findOne({ where: { licenseKey: licenseKey } });

            // if an organization was found, proceed to the endpoints. Else, throw an error
            if (!org) {
                throw new Error('Invalid license')
            } else {
                const token = await jwt.sign({
                    name: org.name,
                    userId: org.id
                }, process.env.JWT_KEY,
                    {
                        expiresIn: '30d'
                    });

                await transaction.commit()
                res.status(200).json(
                    {
                        message: `${org.name} license key verified`,
                        token: token
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
            }
            else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    })();
});

module.exports = router;