const userModel = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    const { last_name, first_name, email, password } = req.body;

    if (!last_name || !first_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const user = await userModel.createUser(last_name, first_name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};