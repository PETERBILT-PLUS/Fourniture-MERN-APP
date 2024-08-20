var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import adminModel from "../model/admin.model.js";
import userModel from "../model/user.model.js";
import messageModel from "../model/message.model";
import conversationModel from "../model/conversation.model.js";
// Function to send a message
export const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { message, receiverId } = req.body;
        const adminSenderId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const userSenderId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        if (!message || !receiverId) {
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        }
        // Check if the sender (either admin or user) exists
        const adminExist = adminSenderId ? yield adminModel.findById(adminSenderId) : null;
        const userExist = userSenderId ? yield userModel.findById(userSenderId) : null;
        if (!adminExist && !userExist) {
            return res.status(404).json({ success: false, message: "Pas Autorisé" });
        }
        // Check if the receiver exists
        const userReceiver = yield userModel.findById(receiverId);
        const adminReceiver = yield adminModel.findById(receiverId);
        if ((adminExist && userReceiver) || (userExist && adminReceiver)) {
            // Find if a conversation already exists between the sender and receiver
            let conversationExist = yield conversationModel.findOne({
                participants: { $all: [userSenderId || adminSenderId, receiverId] }
            });
            if (!conversationExist) {
                // Create a new message
                const newMessage = new messageModel({
                    senderId: userSenderId || adminSenderId,
                    receiverId: receiverId,
                    content: message,
                });
                // Create a new conversation
                const newConversation = new conversationModel({
                    participants: [userSenderId || adminSenderId, receiverId],
                    messages: [newMessage._id]
                });
                // Save the conversation and message
                newConversation.save().then((conversation) => __awaiter(void 0, void 0, void 0, function* () {
                    newMessage.save().then((message) => {
                        // Socket logic here
                        res.status(201).json({ success: true, message: message });
                    }).catch((error) => {
                        console.error(error);
                        res.status(500).json({ success: false, message: "Une Erreur au cours D'enregistrer le message" });
                    });
                })).catch((error) => {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Une Erreur au cours d'enregistrer la conversation" });
                });
                return;
            }
            // If the conversation exists, add the new message to the conversation
            const newMessage = new messageModel({
                senderId: userSenderId || adminSenderId,
                receiverId: receiverId,
                content: message,
            });
            conversationExist.messages.push(newMessage._id);
            // Save the updated conversation and new message
            conversationExist.save().then(() => {
                newMessage.save().then((message) => {
                    // Socket logic here
                    res.status(201).json({ success: true, message: message });
                }).catch((error) => {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Une Erreur au cours de l'enregistrement du message" });
                });
            }).catch((error) => {
                console.error(error);
                res.status(500).json({ success: false, message: "Une Erreur au cours d'enregistrer la conversation" });
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
// Function to get messages from a conversation
export const getSingleMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const adminId = (_b = req.admin) === null || _b === void 0 ? void 0 : _b._id; // Assuming `req.admin` exists if an admin is logged in.
        const { receiverId } = req.body;
        if (!receiverId || (!userId && !adminId)) {
            return res.status(400).json({ success: false, message: "Missing information" });
        }
        // Find the conversation and populate messages
        const conversation = yield conversationModel.findOne({
            participants: { $all: [userId || adminId, receiverId] }
        }).populate('messages'); // Populate messages to get the full message objects
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }
        res.status(200).json({ success: true, messages: conversation.messages });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
export const getAdminUsersForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.admin._id;
        const conversations = yield conversationModel.find({
            participants: { $in: [adminId] }
        });
        if (!conversations)
            return res.status(200).json({ success: false, conversation: [] });
        let participantsIds = new Set();
        conversations.forEach((conversation) => {
            conversation.participants.forEach((participantsId) => {
                if (participantsId.toString() !== adminId.toString()) {
                    participantsIds.add(participantsId.toString());
                }
            });
        });
        const users = yield userModel.find({
            _id: { $in: Array.from(participantsIds) }
        });
        res.status(200).json({ success: true, users: users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
});
