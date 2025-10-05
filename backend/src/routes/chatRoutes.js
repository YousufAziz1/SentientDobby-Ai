const router = require('express').Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listChats, createChat, getMessages, sendMessage, deleteChat, clearChat, editMessage } = require('../controllers/chatController');

router.use(requireAuth);

router.get('/', listChats);
router.post('/', createChat);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);
router.put('/:chatId/messages/:messageId', editMessage);
router.delete('/:chatId', deleteChat);
router.delete('/:chatId/messages', clearChat);

module.exports = router;
