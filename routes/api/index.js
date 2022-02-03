const router = require('express').Router();

router.use('/users', userRoutes)
router.use('/thoughts', thoughtRoutes)





module.exports = router;