const express = require('express')
const Router = express.Router();
const User = require('../model/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


// creating sign for token validation 
// jwt_sign = process.env.JWT_SIGN
const jwt_sign = 'Sign'

//ROUTE 1; creating user using: Post "/api/login/user"
Router.post('/user',
    [// username must be an email
        body('email', 'Enter valid email').isEmail(), 
        // password must be at least 5 chars long
        body('password', 'Password length too short').isLength({ min: 5 }),
        // name should have min 3 char
        body('name', 'Name Should contain 3 letters').isLength({ min: 3 })
    ], async (req, res) => {

        //If validation fails return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            return res.status(400).json({ error: errors.errors[0].msg });
        }

        try {

            // To check email is present in the database
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ error: "user already exist" })
            }


            // to generate salt
            const salt = await bcrypt.genSalt(10);
            let encodePass = await bcrypt.hash(req.body.password, salt)


            // to create user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: encodePass,
            })


            //To generate token using user id and sign
            const userToken = jwt.sign(user.id, jwt_sign)
            res.json({ userToken })


            // to create user using monogoose functions
            // const user = await User(req.body);
            // await user.save();
            // res.send(req.body);
        }
        catch (error) {
            // res.status(400).json({ Error: error.errmsg })
            res.status(500).send("Please Try after some Time!")
        }


    })

//ROUTE 2; creating authenticating user sig-in using: Post "/api/login/signin"
Router.post('/signin',
    [// username must be an email
        body('email', 'Enter valid email').isEmail(),
        // password must be at least 5 chars long
        body('password', 'Password can not be blank').exists(),

    ], async (req, res) => {

        //If validation fails return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            return res.status(400).json({ error: errors.errors[0].msg });

        }

        //destructure
        const { email, password } = req.body;1


        try {

            // To check email is present in the database
            let user = await User.findOne({ email })
            //If not present return error message
            if (!user) {
                return res.status(400).json({ error: "Enter a valid email address" })
            }

            //Comparing input/Entered passward with the existing password in the database
            //password = Entered //user.password = database password (hash)
            //.compare methods mathes the string with hash code // return boolean
            const passswordCompare = await bcrypt.compare(password, user.password)


            //If passward doesn't mathes return error message
            if (!passswordCompare) {
                return res.status(400).json({ error: "Please Enter valid credentials" })
            }


            //To generate token using user id and sign
            const userToken = jwt.sign(user.id, jwt_sign)
            res.json({ userToken })

        } catch (error) {
            console.log(error)
            res.status(500).send("Please Try after some Time!")
        }

    })

//ROUTE 3; To get user details using - POST : "/api/login/getuser"
// fetchuser is the middleware function which get triggers when the end point is hit
Router.post('/getuser', fetchuser, async (req, res) => {
    try {

        // return value from fethuser to userId
        const userId = req.user_id

        //To get the user data using userId // Select is used to get all the details except password
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        // console.log(error)
        res.status(500).send("Please Try after some Time!")
    }
})


module.exports = Router