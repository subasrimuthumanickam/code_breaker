const router = require('express').Router();
const c = require('../controllers/WheelSpinController');

router.get('/config', c.getConfig);
router.post('/', c.spin);
router.post('/consume-time', c.consumeBonusTime);

module.exports = router;

// app.js / server.js la add pannunga:
//   app.use('/api/spin', require('./routes/wheelSpinRoutes'));