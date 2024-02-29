// routes/index.js
const { Router } = require("express");
const router = Router();

const driversRouter = require('./drivers');
const teamsRouter = require('./teams');



router.use('/drivers', driversRouter);
router.use('/teams', teamsRouter);


router.use( (req, res) => {
    res.status(404).send('404 NOT FOUND');
} );

module.exports = router;

