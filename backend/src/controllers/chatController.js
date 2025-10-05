const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { chatCompletion } = require('../services/openrouter');

exports.listChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user_id: req.user.id }).sort({ updated_at: -1 });
    res.json(chats);
  } catch (e) { next(e); }
};

exports.createChat = async (req, res, next) => {
  try {
    const { title } = req.body;
    const chat = await Chat.create({ user_id: req.user.id, title: title || 'New Chat' });
    res.json(chat);
  } catch (e) { next(e); }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat_id: chatId }).sort({ created_at: 1 });
    res.json(messages.map(m => ({ _id: m._id, role: m.role, content: m.content, timestamp: m.created_at, model_used: m.model_used })));
  } catch (e) { next(e); }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content, model } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });

    const userMsg = await Message.create({ chat_id: chatId, role: 'user', content });

    const history = await Message.find({ chat_id: chatId }).sort({ created_at: 1 });
    const msgs = history.map(m => ({ role: m.role, content: m.content }));

    const assistantContent = await chatCompletion(model || 'openrouter/gpt-3.5-turbo', msgs);
    const asst = await Message.create({ chat_id: chatId, role: 'assistant', content: assistantContent, model_used: model });

    res.json({ user: { id: userMsg._id, content: userMsg.content, timestamp: userMsg.created_at }, assistant: { id: asst._id, content: asst.content, timestamp: asst.created_at, model_used: asst.model_used } });
  } catch (e) { next(e); }
};

exports.deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    await Message.deleteMany({ chat_id: chatId });
    await Chat.deleteOne({ _id: chatId });
    res.json({ success: true });
  } catch (e) { next(e); }
};

exports.clearChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    await Message.deleteMany({ chat_id: chatId });
    res.json({ success: true });
  } catch (e) { next(e); }
};

exports.editMessage = async (req, res, next) => {
  try {
    const { chatId, messageId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });

    const chat = await Chat.findOne({ _id: chatId, user_id: req.user.id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    if (String(message.chat_id) !== String(chatId)) return res.status(400).json({ error: 'Message does not belong to chat' });
    if (message.role !== 'user') return res.status(403).json({ error: 'Only user messages can be edited' });

    message.content = content;
    await message.save();
    res.json(message);
  } catch (e) { next(e); }
};
