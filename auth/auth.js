const jwt = require('jsonwebtoken');
const db = require('../services/mysql_service.js');
const dotenv = require("dotenv");
dotenv.config();

const auth = async (req, res, next) => {
  

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    //Check if the token is blacklisted
    const [rows] = await db.query('SELECT * FROM token_blacklist WHERE token = ?', [token]);
    if (rows.length > 0) {
      return res.status(401).send('Token has been invalidated');
    }

    //Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};

module.exports = auth;