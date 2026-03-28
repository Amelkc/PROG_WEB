//https://www.youtube.com/watch?v=SccSCuHhOw0

const express = require('express');
//const cors = require('cors');

const eventRoutes = require('./routes/eventRoutes');

const app = express();

// app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('EventHub API is running');
});

app.use('/api/events', eventRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});