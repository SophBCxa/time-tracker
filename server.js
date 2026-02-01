const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/time-tracker';
mongoose.connect(mongoUri);

const activityCodeSchema = new mongoose.Schema({
    label: String,
    color: String,
    client: String,
    icon: String,
});

const ActivityCode = mongoose.model('ActivityCode', activityCodeSchema);

// Route pour ajouter un code d'activité
app.post('/api/activity-codes', async (req, res) => {
    try {
        const { label, color, client, icon } = req.body;
        const newCode = new ActivityCode({ label, color, client, icon });
        await newCode.save();
        res.status(201).send(newCode);
    } catch (error) {
        console.error('Error adding activity code:', error);
        res.status(500).json({ error: 'Failed to add activity code' });
    }
});

// Route pour récupérer les codes d'activité
app.get('/api/activity-codes', async (req, res) => {
    try {
        const codes = await ActivityCode.find();
        res.send(codes);
    } catch (error) {
        console.error('Error fetching activity codes:', error);
        res.status(500).json({ error: 'Failed to fetch activity codes' });
    }
});

// Route pour supprimer un code d'activité
app.delete('/api/activity-codes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCode = await ActivityCode.findByIdAndDelete(id);
        if (!deletedCode) {
            return res.status(404).json({ error: 'Activity code not found' });
        }
        res.send(deletedCode);
    } catch (error) {
        console.error('Error deleting activity code:', error);
        res.status(500).json({ error: 'Failed to delete activity code' });
    }
});

// Route pour mettre à jour un code d'activité
app.patch('/api/activity-codes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCode = await ActivityCode.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCode) {
            return res.status(404).json({ error: 'Activity code not found' });
        }
        res.send(updatedCode);
    } catch (error) {
        console.error('Error updating activity code:', error);
        res.status(500).json({ error: 'Failed to update activity code' });
    }
});

const timeEntrySchema = new mongoose.Schema({
    activityCode: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityCode', required: true },
    timeSpent: Number,
    date: { type: Date, default: Date.now },
    details: String,
    saisie: {
        nisa: { type: Boolean, default: false },
        perso: { type: Boolean, default: false },
        equipes: { type: Boolean, default: false },
    },
});

const TimeEntry = mongoose.model('TimeEntry', timeEntrySchema);

app.post('/api/time-entries', async (req, res) => {
    try {
        const { activityCode, timeSpent, date, details, saisie } = req.body;
        const newEntry = new TimeEntry({ activityCode, timeSpent, date, details, saisie });
        await newEntry.save();
        await newEntry.populate('activityCode');
        res.status(201).send(newEntry);
    } catch (error) {
        console.error('Error adding time entry:', error);
        res.status(500).json({ error: 'Failed to add time entry' });
    }
});

app.get('/api/time-entries', async (req, res) => {
    try {
        const entries = await TimeEntry.find().populate('activityCode');
        res.send(entries);
    } catch (error) {
        console.error('Error fetching time entries:', error);
        res.status(500).json({ error: 'Failed to fetch time entries' });
    }
});

// Route pour supprimer une entrée de temps
app.delete('/api/time-entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await TimeEntry.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({ error: 'Time entry not found' });
        }
        res.send(deletedEntry);
    } catch (error) {
        console.error('Error deleting time entry:', error);
        res.status(500).json({ error: 'Failed to delete time entry' });
    }
});

// Route pour mettre à jour une entrée de temps (ex: saisie)
app.patch('/api/time-entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEntry = await TimeEntry.findByIdAndUpdate(id, req.body, { new: true })
            .populate('activityCode');
        if (!updatedEntry) {
            return res.status(404).json({ error: 'Time entry not found' });
        }
        res.send(updatedEntry);
    } catch (error) {
        console.error('Error updating time entry:', error);
        res.status(500).json({ error: 'Failed to update time entry' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});