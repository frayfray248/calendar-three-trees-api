const { Organization, OrganizationProgram } = require('../models/Models');

/*
*   This middleware checks the authorization for each api request. It compares the 'z' attribute
*   in the request header to an organization's transport token in the database. If an organization was
*   found then the request passes authorization and the next middleware is called.
*/

module.exports = (req, res, next) => {
    (async () => {
        try {
            const z = req.headers.z; // request transport token

            if (!z) throw new Error('bad request'); // absent request transport token error throw

            // finding an organization with a matching transport tokens
            const org = await Organization.findOne({
                where: {
                    transportToken: z,
                }
            });

            if (!org) throw new Error('unauthorized');

            // checking to see if the organization with the transport token
            // has access to the query program 
            const organizationProgram = await OrganizationProgram.findOne({
                where: {
                    organizationId: org.id,
                    programId : req.params.groupId
                }
            });

            if (!organizationProgram) throw new Error('unauthorized');

            next();

        } catch (err) { // ERRORS

            console.log(err);

            if (err.message === 'bad request') {
                res.status(400).json({ message: 'Bad or malformed request' });
            } else if (err.message === 'unauthorized') {
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    })();
};