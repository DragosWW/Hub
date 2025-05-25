// backend/controllers/userController.js (Exemplu)
const User = require('../models/User');

// @desc    Obține evenimentele salvate de utilizatorul logat
// @route   GET /api/users/me/saved-events
// @access  Private
exports.getSavedEvents = async (req, res) => {
  try {
    // req.user.id este setat de middleware-ul 'protect'
    const user = await User.findById(req.user.id).select('savedEvents');
    if (!user) {
      return res.status(404).json({ msg: 'Utilizator negăsit' });
    }
    res.json(user.savedEvents);
  } catch (err) {
    console.error("Eroare la getSavedEvents:", err.message);
    res.status(500).send('Eroare Server');
  }
};

// @desc    Adaugă un eveniment la lista utilizatorului logat
// @route   POST /api/users/me/saved-events
// @access  Private
exports.addSavedEvent = async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) {
    return res.status(400).json({ msg: 'ID-ul evenimentului este necesar.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Utilizator negăsit' });
    }

    if (!user.savedEvents.includes(eventId)) {
      user.savedEvents.push(eventId);
      await user.save();
    }
    res.status(200).json(user.savedEvents);
  } catch (err) {
    console.error("Eroare la addSavedEvent:", err.message);
    res.status(500).send('Eroare Server');
  }
};

// @desc    Șterge un eveniment din lista utilizatorului logat
// @route   DELETE /api/users/me/saved-events/:eventId
// @access  Private
exports.removeSavedEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Utilizator negăsit' });
    }

    user.savedEvents = user.savedEvents.filter(id => id !== eventId);
    await user.save();
    res.status(200).json(user.savedEvents);
  } catch (err) {
    console.error("Eroare la removeSavedEvent:", err.message);
    res.status(500).send('Eroare Server');
  }
};