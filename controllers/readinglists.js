const router = require('express').Router();
const { ReadingList } = require('../models');
const { tokenExtractor, userExtractor } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { blog_id, user_id } = req.body;
    const entry = await ReadingList.create({
      blogId: blog_id,
      userId: user_id
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id);
    
    if (!readingListEntry) {
      return res.status(404).json({ error: 'Reading list entry not found' });
    }

    if (readingListEntry.userId !== req.user.id) {
      return res.status(401).json({ error: 'Can only mark own reading list entries as read' });
    }

    readingListEntry.read = req.body.read;
    await readingListEntry.save();
    
    res.json(readingListEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;