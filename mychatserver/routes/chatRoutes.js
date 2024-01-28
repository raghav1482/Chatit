const express= require("express");
const {accessChat , fetchChats,deleteGRP, createGroupsChat,fetchGroups,groupExit, addSelfToGrp, searchChat, searchGrp,reqGrp,getreq, grpaccept, grpreject} = require("../controller/chatController");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.post('/' ,protect, accessChat);
router.get('/' ,protect, fetchChats);
router.post('/creategrp' ,protect, createGroupsChat);
router.get('/fetchgrps' ,protect, fetchGroups);
router.get('/searchchat' ,protect, searchChat);
router.get('/searchgroup' ,protect, searchGrp);
router.post('/sendgrpreq' ,protect, reqGrp);
router.get('/getgrpreq' ,protect, getreq);
router.put('/grpaccept' ,protect, grpaccept);
router.delete('/grpreject' ,protect, grpreject);
router.put('/grpexit' ,protect, groupExit);
router.delete('/deletegrp' ,protect, deleteGRP);



module.exports = router;