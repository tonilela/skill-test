const express = require('express');
const router = express.Router();
const bcryptjs= require("bcryptjs")
const jwt = require('jsonwebtoken');
const db = require('../../../databse/models');
const User = db.User;

const mailgun = require('mailgun-js');

const mg = mailgun({
  domain: process.env.MAILGUN_DOMAIN,
  url: 'https://api.eu.mailgun.net', 
  apiKey: process.env.MAILGUN_API_KEY
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already taken' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    await User.create({ email, password: hashedPassword, name });

    const msg = {
      from: 'skill-test@email.com',
      to: email, 
      subject: "Registration mail",
      text: `Thanks for the registration ${name}`,
    };

    mg.messages().send(msg, function (error) {
      if (error) {
          return res.status(500).send({ message: error.message });
      }
      res.status(201).send({ message: 'Email sent successfully'});
    });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && await bcryptjs.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, name: user.name });
    } else {
        res.status(400).json({error: 'Invalid Credentials'});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
