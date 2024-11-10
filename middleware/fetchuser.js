const jwt = require('jsonwebtoken');

const jwt_sign = 'Sign'

const fetchuser = (req, res, next) => {

    //To get the user using jws token and add id to req object
    const token = req.header("auth-token")
    if (!token) {
        res.status(401).send({ Error: "Please authenticate using valid token" })
    }

    try {
        // To verify using token sign and return user id 
        const data = jwt.verify(token, jwt_sign)

        // assigning verified user id to the req.user_id
        req.user_id = data;

        //To call next function
        next();
    } catch (error) {
        res.status(401).send({ Error: "Please authenticate using valid token" })
    }
}

module.exports = fetchuser;