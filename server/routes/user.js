const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const regcontroller = require('../controllers/register');
const { loginuser, logPage } = require('../controllers/login');
const { eventss, addevent, fest, gtg, wed, other, meet, evo, } = require('../controllers/events');
const { landing } = require('../controllers/landing');

// create find, update, delete
router.get('/', landing);



router.get('/event/:id', userController.view);
router.post('/event/:id', userController.find);

router.get('/adduser/:id', userController.form);
router.post('/adduser/:id', userController.create);

router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);

router.get('/viewuser/:id', userController.viewall);
router.get('/guestview/:id', userController.gestview);

router.get('/arrived/:id', userController.delete);
router.get('/:id', userController.np);


router.get('/user/arrived', userController.arrived);

router.get('/register/user', regcontroller.reggPage);
router.post('/registerrrr', regcontroller.registerUser);


router.get('/login/user', logPage);
router.post('/log', loginuser);

router.get("/user/events/:id", eventss);


router.post("/user/events/add/:id", addevent);

router.get('/evo/:id', evo);


router.get('/fest/:id', fest);
router.get('/meet/:id', meet);
router.get('/gtg/:id', gtg);
router.get('/wedding/:id', wed);
router.get('/other/:id', other);


module.exports = router;