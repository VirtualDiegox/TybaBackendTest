
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../services/mysql_service.js')
const { getNearbyPlacesByCity, getNearbyPlacesByCordinates } = require('../services/locations_service.js')
const dotenv = require("dotenv");
dotenv.config();


const Register = async (req, res, next) => {
    //Info to register user
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    //just try register if there is all info available
    if (username && name && password) {
        try {
            //Check if user exist in db
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length != 0) {
                return res.status(401).send('Username already exist');
            }
            //Hash password
            const hashpass = await bcrypt.hash(password, 10);
            await db.query('INSERT INTO users (username, name, password) VALUES (?, ?, ?)', [username, name, hashpass]);
            let message = 'User registered successfully!'
            //Record action
            await db.query('INSERT INTO movements (username, date, action) VALUES (?, ?, ?)', [username, new Date(), "Register"]);
            return res.status(200).json({status: message});
        } catch (err) {
            res.status(500).send(err.message)
        }
    } else {
        //if there is some missing return with a message indicating what
        let message = ''
        if (username==null) {
            message = message + '\n' +'Username is required!'
        }
        if (password==null) {
            message = message + '\n' +'Password is required!'
        }
        if (name==null) {
            message = message + '\n' +'Name is required!'
        }
        
        res.status(200).send({status: message})
    }
}

const Login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        try {
            //Check if user exist in db
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length === 0) {
                return res.status(400).send('Invalid credentials');
            }
            const user = rows[0];
            //Check if password is correct
            const passwordvalid = await bcrypt.compare(password, user.password);
            if (!passwordvalid) {
                return res.status(400).send('Invalid credentials');
            }

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            await db.query('INSERT INTO movements (username, date, action) VALUES (?, ?, ?)', [username, new Date(), "Login"]);

            let message = 'User loggen in successfully!'
            return res.status(200).json({status: message, token: token});
        } catch (err) {
            res.status(500).send(err.message)
        }
    }else {
        let message = ''
        if (username==null) {
            message = message + '\n' +'Username is required!'
        }
        if (password==null) {
            message = message + '\n' +'Password is required!'
        }
        res.status(200).send({status: message})
    }
}

const CheckNearbyRestaurants = async (req, res, next) => {
    const city = req.body.city;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const username = req.user.username;
    let nb = await getNearbyPlacesByCity(city)
    await db.query('INSERT INTO movements (username, date, action) VALUES (?, ?, ?)', [username, new Date(), "CheckNearbyRestaurants"]);
    return res.status(200).json(nb);
}

const MovementsRecord = async (req, res, next) => {
    const username = req.user.username
    //Check movements of the user
    const [rows] = await db.query('SELECT * FROM movements WHERE username = ?', [username]);
    if (rows.length === 0) {
        return res.status(404).send('No movements found');
    }
    return res.status(200).json(rows);
}

const Logout = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiry = new Date(decoded.exp * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await db.query('INSERT INTO token_blacklist (token, expiry) VALUES (?, ?)', [token, expiry]);
        await db.query('INSERT INTO movements (username, date, action) VALUES (?, ?, ?)', [decoded.username, new Date(), "Logout"]);
        let message = 'User logged out successfully!';
        return res.status(200).json({status: message});
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = { Register, 
                   Login, 
                   CheckNearbyRestaurants, 
                   MovementsRecord,
                   Logout
                };