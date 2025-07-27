import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  
    try {

        const token= generateStreamToken(req.user.id);
        res.status(200).json({ token }); // send the token back to the client for authentication with Stream

    } catch (error) {

        console.error('Error generating stream token in getStreamToken:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    
    }

}
