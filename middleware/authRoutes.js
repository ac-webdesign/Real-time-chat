const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.json({ message: 'Login successful' });
  });   

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.json({ message: 'Signup successful' });
  });   

module.exports = router;
  
  