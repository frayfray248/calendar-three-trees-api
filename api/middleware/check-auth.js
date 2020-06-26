const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    (async () => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            await jwt.verify(token, process.env.JWT_KEY);
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }    
    })();
};