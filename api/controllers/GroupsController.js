const db = require('../../database');
const Sequelize = require('sequelize');
const { Op, ValidationError } = Sequelize;
const { Program, Organization } = require('../models/Models');

exports.getGroups = (req, res, next) => {
    (async () => {

        // begining transaction
        const transaction = await db.transaction();

        try {

            const z = req.headers.z; // request transport token

            if (!z) throw new Error('bad request'); // absent request transport token error throw

            const org = await Organization.findOne({
                where: {
                    transportToken: z,
                },
                include: [{ model: Program, as: 'programs' }]
            });

            if (!org) throw new Error('unauthorized');

            const programs = org.programs.map(program => ({ id: program.id, name: program.name}));

            //commit transaction
            await transaction.commit();

            res.status(200).send({programs});


        } catch (err) {

            await transaction.rollback();

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
}