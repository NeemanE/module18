const router = require('express').Router();

const userRoute = require('./user-route');
const thoughtRoute = require('./thought-route');

router.use('/user', userRoute);
router.use('/thought', thoughtRoute);

module.exports = router;