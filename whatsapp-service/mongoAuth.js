// mongoAuth.js - MongoDB session storage for Baileys
// Place this in the whatsapp-service folder on your laptop
const { MongoClient } = require('mongodb');
const { initAuthCreds } = require('@whiskeysockets/baileys');

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let collection;

// Initialize MongoDB and collection
async function initMongo() {
    if (!collection) {
        await client.connect();
        const db = client.db(process.env.DB_NAME || "xac_crm_db");
        collection = db.collection("whatsapp_sessions");
    }
}

// Get or create auth state for a user
async function useMongoAuthState(sessionId) {
    await initMongo();

    let session = await collection.findOne({ sessionId });

    if (!session) {
        session = {
            sessionId,
            data: {
                creds: initAuthCreds(),
                keys: {}
            }
        };
        await collection.insertOne(session);
    }

    return {
        state: session.data,
        saveCreds: async (data) => {
            await collection.updateOne(
                { sessionId },
                { $set: { data } },
                { upsert: true }
            );
        }
    };
}

module.exports = { useMongoAuthState };
