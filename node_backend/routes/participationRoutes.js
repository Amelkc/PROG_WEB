const express = require('express');
const participationController = require('../controllers/participationController');
const router = express.Router();

// CRUD Functions 
router.post('/', participationController.addParticipation);

router.get('/event/:eventId', participationController.getByEvent);

router.delete('/:eventId/:userId', participationController.removeParticipation);

module.exports = router;