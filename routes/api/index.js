const router = require('express').Router();

const userRoute = require('./user-route');
const thoughtRoute = require('./thought-route');

router.use('/users', userRoute);
router.use('/thoughts', thoughtRoute);

module.exports = router;