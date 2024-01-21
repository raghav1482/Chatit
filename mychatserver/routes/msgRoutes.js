const express= require("express");
const {allMessages , sendMessage} = require("../controller/messageController");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.get('/:chatId' ,protect, allMessages);
router.post('/' ,protect, sendMessage);



module.exports = router;