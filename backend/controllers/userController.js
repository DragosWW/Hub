
const User = require('../models/User');


exports.getSavedEvents = async (req, res) => {
  try {
    
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