const participationModel = require('../models/participationModel');

exports.addParticipation = async (req, res) => {
  try {
    const { event_id, user_id } = req.body;

    if (!event_id || !user_id) {
      return res.status(400).json({ error: 'event_id and user_id are required' });
    }

    const participation = await participationModel.addParticipation(event_id, user_id);
    res.status(201).json(participation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByEvent = async (req, res) => {
  try {
    const participants = await participationModel.getParticipantsByEvent(req.params.eventId);
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeParticipation = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    const deleted = await participationModel.deleteParticipation(eventId, userId);

    if (deleted === 0) {
      return res.status(404).json({ error: 'Participation not found' });
    }

    res.json({ message: 'Participation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};