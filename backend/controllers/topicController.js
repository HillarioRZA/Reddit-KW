const Topic = require('../models/Topic');
const Category = require('../models/Category');

// Create Topic
const createTopic = async (req, res) => {
  const { userId, categoryId, title, content, tags } = req.body;

  try {
    // Validate categoryId
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid categoryId' });
    }

    const topic = new Topic({ userId, categoryId, title, content, tags });
    await topic.save();
    res.status(201).json({ message: 'Topic created successfully', topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ isDeleted: false })
      .populate('userId', 'username avatarUrl') // Populate user details
      .populate('categoryId', 'name'); // Populate category details

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Topic by ID
const getTopicById = async (req, res) => {
  const { topicId } = req.params;

  try {
    const topic = await Topic.findOne({ _id: topicId, isDeleted: false })
      .populate('userId', 'username avatarUrl') // Populate user details
      .populate('categoryId', 'name'); // Populate category details

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Increment view count
    topic.viewCount += 1;
    await topic.save();

    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Topic
const updateTopic = async (req, res) => {
  const { topicId } = req.params;
  const { title, content, tags } = req.body;

  try {
    const topic = await Topic.findById(topicId);

    if (!topic || topic.isDeleted) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Update fields
    topic.title = title || topic.title;
    topic.content = content || topic.content;
    topic.tags = tags || topic.tags;

    await topic.save();
    res.status(200).json({ message: 'Topic updated successfully', topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Soft Delete Topic
const deleteTopic = async (req, res) => {
  const { topicId } = req.params;

  try {
    const topic = await Topic.findById(topicId);

    if (!topic || topic.isDeleted) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Mark as deleted
    topic.isDeleted = true;
    await topic.save();

    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic };
