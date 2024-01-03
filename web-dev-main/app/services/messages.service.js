const messageModel = require("../models/messageModel");

const getMessages = async (req, res) => {
  const messages = await messageModel
    .find({})
    .sort({ created_at: "desc" })
    .populate("user");

  return res.status(200).json(messages);
};

const getMessageById = async (req, res) => {
  const { messageId } = req.params;
  let message;

  try {
    message = await messageModel.findOne({ _id: messageId });
  } catch (error) {
    console.log("Error while getting message by id", error.message);
    return res.status(500).json({ error: "Error while getting message by id" });
  }

  return res.status(200).json(message);
};

const addMessage = async (req, res) => {
  const { message } = req.body;

  if (!req.session.user) {
    return res.status(400).json({ message: "user not found" });
  }

  message.user = req.session.user._id;

  try {
    const messageObj = new messageModel(message);
    await messageObj.save();
    return res.status(200).json(messageObj);
  } catch (error) {
    console.log("Error while saving message in DB", error.message);
    return res.status(500).json({ error: "Error while adding message" });
  }
};

const editMessage = async (req, res) => {
  const { name } = req.body;
  const { messageId } = req.params;

  if (!name || !messageId) {
    return res.status(400).json({ error: "missing information" });
  }

  try {
    const message = await messageModel.findByIdAndUpdate(
      messageId,
      {
        name, // this is the equivalent of writing name : name
      },
      {
        new: true,
      }
    );

    return res.status(200).json(message);
  } catch (error) {
    console.log("error while editing message", error.message);
    return res.status(500).json({ error: "error while editing message" });
  }
};

module.exports = {
  getMessages,
  getMessageById,
  addMessage,
  editMessage,
};
