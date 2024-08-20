import { Request, Response } from "express";
import adminModel, { IAdmin } from "../model/admin.model.js";
import userModel, { IUser } from "../model/user.model.js";
import messageModel, { IMessage } from "../model/message.model";
import conversationModel, { IConversation } from "../model/conversation.model.js";


// Function to send a message
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message, receiverId } = req.body;
        const adminSenderId = req.admin?._id;
        const userSenderId = req.user?._id;

        if (!message || !receiverId) {
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        }

        // Check if the sender (either admin or user) exists
        const adminExist: IAdmin | null = adminSenderId ? await adminModel.findById(adminSenderId) : null;
        const userExist: IUser | null = userSenderId ? await userModel.findById(userSenderId) : null;

        if (!adminExist && !userExist) {
            return res.status(404).json({ success: false, message: "Pas Autorisé" });
        }

        // Check if the receiver exists
        const userReceiver: IUser | null = await userModel.findById(receiverId);
        const adminReceiver: IAdmin | null = await adminModel.findById(receiverId);

        if ((adminExist && userReceiver) || (userExist && adminReceiver)) {
            // Find if a conversation already exists between the sender and receiver
            let conversationExist: IConversation | null = await conversationModel.findOne({
                participants: { $all: [userSenderId || adminSenderId, receiverId] }
            });

            if (!conversationExist) {
                // Create a new message
                const newMessage: IMessage = new messageModel({
                    senderId: userSenderId || adminSenderId,
                    receiverId: receiverId,
                    content: message,
                });

                // Create a new conversation
                const newConversation: IConversation = new conversationModel({
                    participants: [userSenderId || adminSenderId, receiverId],
                    messages: [newMessage._id]
                });

                // Save the conversation and message
                newConversation.save().then(async (conversation: IConversation) => {
                    newMessage.save().then((message: IMessage) => {
                        // Socket logic here
                        res.status(201).json({ success: true, message: message });
                    }).catch((error: any) => {
                        console.error(error);
                        res.status(500).json({ success: false, message: "Une Erreur au cours D'enregistrer le message" });
                    });
                }).catch((error: any) => {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Une Erreur au cours d'enregistrer la conversation" });
                });
                return;
            }

            // If the conversation exists, add the new message to the conversation
            const newMessage: IMessage = new messageModel({
                senderId: userSenderId || adminSenderId,
                receiverId: receiverId,
                content: message,
            });

            conversationExist.messages.push(newMessage._id as string);

            // Save the updated conversation and new message
            conversationExist.save().then(() => {
                newMessage.save().then((message: IMessage) => {
                    // Socket logic here
                    res.status(201).json({ success: true, message: message });
                }).catch((error: any) => {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Une Erreur au cours de l'enregistrement du message" });
                });
            }).catch((error: any) => {
                console.error(error);
                res.status(500).json({ success: false, message: "Une Erreur au cours d'enregistrer la conversation" });
            });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

// Function to get messages from a conversation
export const getSingleMessages = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const adminId = req.admin?._id; // Assuming `req.admin` exists if an admin is logged in.
        const { receiverId } = req.body;

        if (!receiverId || (!userId && !adminId)) {
            return res.status(400).json({ success: false, message: "Missing information" });
        }

        // Find the conversation and populate messages
        const conversation: IConversation | null = await conversationModel.findOne({
            participants: { $all: [userId || adminId, receiverId] }
        }).populate('messages'); // Populate messages to get the full message objects

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        res.status(200).json({ success: true, messages: conversation.messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getAdminUsersForSidebar = async (req: Request, res: Response) => {
    try {
        const adminId = req.admin._id;

        const conversations: IConversation[] = await conversationModel.find({
            participants: { $in: [adminId] }
        });

        if (!conversations) return res.status(200).json({ success: false, conversation: [] });

        let participantsIds = new Set<string>();

        conversations.forEach((conversation: IConversation) => {
            conversation.participants.forEach((participantsId) => {
                if (participantsId.toString() !== adminId.toString()) {
                    participantsIds.add(participantsId.toString());
                }
            })
        });

        const users: IUser[] | null = await userModel.find({
            _id: { $in: Array.from(participantsIds) }
        });

        res.status(200).json({ success: true, users: users });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne du Serveur" });
    }
}

