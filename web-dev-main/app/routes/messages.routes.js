const express = require("express");
const router = express.Router();

const messageServices = require("../services/messages.service");

// routes here
router.get("/", messageServices.getMessages);
router.get("/:messageId", messageServices.getMessageById);
router.post("/add/message", messageServices.addMessage);
router.put("/edit/:messageId", messageServices.editMessage);
// router.delete('/delete/:messageId')

module.exports = router;
