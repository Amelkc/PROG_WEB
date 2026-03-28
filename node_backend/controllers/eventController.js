const eventModel = require('../models/eventModel');

exports.getEvents = async (req, res) => {
  try {
    const events = await eventModel.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, start_date, end_date, location } = req.body;
    const id = await eventModel.createEvent(title, description, start_date, end_date, location);
    res.status(201).json({ id, message: 'Event créé !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await eventModel.getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event non trouvé' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    await eventModel.updateEvent(req.params.id, req.body);
    res.json({ message: 'Event modifié !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await eventModel.deleteEvent(req.params.id);
    if (deleted === 0) return res.status(404).json({ error: 'Event non trouvé' });
    res.json({ message: 'Event supprimé !' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};