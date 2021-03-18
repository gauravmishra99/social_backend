const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/decode", async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    let sent = false;
    user.tokens.forEach((token) => {
      if (token.token === req.cookies.token) {
        sent = true;
      }
    });

    if (sent === false) {
      throw new Error("token not found");
    }
    else{
      res.send(true)
    }
  } catch (error) {
    res.send(false);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    console.log(user);
    res.cookie("token", token, { httpOnly: true });
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/findByEmail", auth, async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    console.log(user);
    res.send({ user });
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
