const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const processRoutes = require('./routes/processes');
const stepRoutes = require('./routes/steps');
const instanceRoutes = require('./routes/instances');
const organizationRoutes = require('./routes/organization');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/processes', stepRoutes);
app.use('/api/instances', instanceRoutes);
app.use('/api/organization', organizationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`BPMS API running on port ${PORT}`);
});
