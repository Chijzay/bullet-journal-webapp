const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const auth = require('../middleware/auth');

// GET /api/journal/:date  -> Eintrag für ein Datum holen
router.get('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;

    const entry = await JournalEntry.findOne({
      user: req.user.id,
      date,
    });

    // Wenn kein Eintrag existiert, geben wir null zurück
    return res.json(entry || null);
  } catch (err) {
    console.error('Error fetching journal entry', err);
    res.status(500).json({ message: 'Serverfehler beim Laden des Journal-Eintrags' });
  }
});

// POST /api/journal       -> Eintrag für ein Datum speichern/aktualisieren (Upsert)
router.post('/', auth, async (req, res) => {
  try {
    const { date, gratitude, bestTasks, mood, water, notes } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Datum (date) ist erforderlich.' });
    }

    const data = {
      user: req.user.id,
      date,
      gratitude: Array.isArray(gratitude) ? gratitude : [],
      bestTasks: Array.isArray(bestTasks) ? bestTasks : [],
      mood: typeof mood === 'number' ? mood : 3,
      water: typeof water === 'number' ? water : 0,
      notes: notes || '',
    };

    const entry = await JournalEntry.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: data },
      { upsert: true, new: true }
    );

    res.json(entry);
  } catch (err) {
    console.error('Error saving journal entry', err);
    res.status(500).json({ message: 'Serverfehler beim Speichern des Journal-Eintrags' });
  }
});

module.exports = router;
