// stream.js
import { StreamChat } from 'stream-chat';
import 'dotenv/config';

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.log('Stream Chat API key and secret are required');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// ✅ Create or update a user
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log('Error while creating user in Stream Chat:', error);
  }
};

// ✅ Generate token for a user (returns string)
export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    const token = streamClient.createToken(userIdStr); // ✅ returns a string
    return token;
  } catch (error) {
    console.error('Error generating stream token:', error.message);
    return null; // ⛔ Always return something on failure
  }
};
