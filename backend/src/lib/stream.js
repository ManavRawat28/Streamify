import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apiKey ||!apiSecret) {
 console.log('stream chat api key and secret are required');
}
 const streamClient= StreamChat.getInstance(apiKey,apiSecret);  // to communicate with stream Application
   
// create user in stream chat

 export const upsertStreamUser= async (UserData) =>{
    try {
        await streamClient.upsertUsers([UserData]); // to create user/update in stream chat
        return UserData;
    } catch (error) {
        console.log('error while creating user in stream chat',error);
    }
 }
 // todo do itlater
export const generateStreamToken = async (userId) =>{
 
    try{
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr); // to generate token for user to authenticate with stream chat
    } catch (error) {
        console.error('Error generating stream token:', error.message);
        
    }

};