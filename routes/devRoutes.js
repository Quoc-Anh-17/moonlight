const router = require('express').Router();
const dev = require('../controllers/devControllers')

router.put('/log', dev.getLog)
router.post('/log', dev.postLog)
router.delete('/log', dev.deleteLog)

module.exports = router