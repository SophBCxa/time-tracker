require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

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

// 🔧 Remplacer par votre Tenant ID Azure AD
const TENANT_ID = process.env.AZURE_TENANT_ID || 'VOTRE_TENANT_ID_ICI';
const LOCAL_JWT_SECRET = process.env.LOCAL_JWT_SECRET || 'dev-secret-change-me';

// Utilisateurs locaux : configurables via LOCAL_USERS="user1:pass1,user2:pass2"
const localUsers = (process.env.LOCAL_USERS || 'admin:admin')
    .split(',')
    .reduce((acc, entry) => {
        const [username, password] = entry.split(':');
        if (username && password) acc[username.trim()] = password.trim();
        return acc;
    }, {});

const jwks = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
    cache: true,
    rateLimit: true,
});

function getSigningKey(header, callback) {
    jwks.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        callback(null, key.getPublicKey());
    });
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    const token = authHeader.split(' ')[1];

    // Essayer d'abord le token local
    try {
        const decoded = jwt.verify(token, LOCAL_JWT_SECRET);
        if (decoded.iss === 'time-tracker-local') {
            req.user = decoded;
            return next();
        }
    } catch (_) {
        // Pas un token local, on essaie MSAL
    }

    // Vérification token MSAL
    jwt.verify(token, getSigningKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        req.user = decoded;
        next();
    });
}

app.use('/api', verifyToken);

// Health check (non protégé)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Login local (non protégé par verifyToken)
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || localUsers[username] !== password) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign(
        { iss: 'time-tracker-local', sub: username, name: username },
        LOCAL_JWT_SECRET,
        { expiresIn: '8h' }
    );
    res.json({ token, name: username });
});

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

// ── Nouveaux schémas domaine ──────────────────────────────────────────────────

const activitySchema = new mongoose.Schema({
    id:        { type: String, required: true },
    owner:     { type: String, required: true },
    date:      { type: String, required: true },
    timeSpent: { type: Number, required: true },
    project:   { type: String, required: true },
    type:      { type: String, default: '' },
    detail:    { type: String, default: '' },
});

const Activity = mongoose.model('Activity', activitySchema);

const projectSchema = new mongoose.Schema({
    id:           { type: String, required: true },
    owner:        { type: String, required: true },
    name:         { type: String, required: true },
    nisaCode:     { type: String, default: '' },
    color:        { type: String, default: '#6c757d' },
    allowedTypes: [String],
});

const Project = mongoose.model('Project', projectSchema);

const globalTypeSchema = new mongoose.Schema({
    owner: { type: String, required: true, unique: true },
    types: [String],
});

const GlobalType = mongoose.model('GlobalType', globalTypeSchema);

// ── Routes activités ──────────────────────────────────────────────────────────

app.get('/api/activities', async (req, res) => {
    try {
        const owner = req.user.sub;
        const { from, to } = req.query;
        const filter = { owner };
        if (from && to) {
            filter.date = { $gte: from, $lte: to };
        }
        const activities = await Activity.find(filter).sort({ date: 1 });
        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

app.post('/api/activities', async (req, res) => {
    try {
        const owner = req.user.sub;
        const activity = new Activity({ ...req.body, owner });
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

app.patch('/api/activities/:id', async (req, res) => {
    try {
        const owner = req.user.sub;
        const activity = await Activity.findOneAndUpdate(
            { id: req.params.id, owner },
            req.body,
            { new: true }
        );
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ error: 'Failed to update activity' });
    }
});

app.delete('/api/activities/:id', async (req, res) => {
    try {
        const owner = req.user.sub;
        const activity = await Activity.findOneAndDelete({ id: req.params.id, owner });
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});

// ── Routes projets ────────────────────────────────────────────────────────────

app.get('/api/projects', async (req, res) => {
    try {
        const owner = req.user.sub;
        const projects = await Project.find({ owner });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const owner = req.user.sub;
        const project = new Project({ ...req.body, owner });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.patch('/api/projects/:id', async (req, res) => {
    try {
        const owner = req.user.sub;
        const project = await Project.findOneAndUpdate(
            { id: req.params.id, owner },
            req.body,
            { new: true }
        );
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const owner = req.user.sub;
        const project = await Project.findOneAndDelete({ id: req.params.id, owner });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// ── Routes types globaux ──────────────────────────────────────────────────────

app.get('/api/types', async (req, res) => {
    try {
        const owner = req.user.sub;
        const doc = await GlobalType.findOne({ owner });
        res.json(doc ? doc.types : []);
    } catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).json({ error: 'Failed to fetch types' });
    }
});

app.post('/api/types', async (req, res) => {
    try {
        const owner = req.user.sub;
        const { type } = req.body;
        if (!type) return res.status(400).json({ error: 'type is required' });
        await GlobalType.findOneAndUpdate(
            { owner },
            { $addToSet: { types: type } },
            { upsert: true, new: true }
        );
        res.status(201).json({ ok: true });
    } catch (error) {
        console.error('Error adding type:', error);
        res.status(500).json({ error: 'Failed to add type' });
    }
});

app.delete('/api/types/:type', async (req, res) => {
    try {
        const owner = req.user.sub;
        await GlobalType.findOneAndUpdate(
            { owner },
            { $pull: { types: req.params.type } }
        );
        res.json({ ok: true });
    } catch (error) {
        console.error('Error deleting type:', error);
        res.status(500).json({ error: 'Failed to delete type' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});