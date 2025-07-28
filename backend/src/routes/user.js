import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUsers, getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendReqs } from '../controllers/user.controller.js';

const router = express.Router();

router.use(protectedRoute); // Applying protectedRoute middleware to all routes in this file

router.get('/',getRecommendedUsers);
router.get('/friends',getMyFriends);

router.post('/friend-requests/:id',sendFriendRequest);// send friend request to user with id
router.put('/friend-request/:id/accept',acceptFriendRequest);// accept friend request from user with id


router.get('/friend-requests/',getFriendRequests);// get all friend requests for the user pending
router.get('/outgoing-friend-requests',getOutgoingFriendReqs);// get all outgoing friend requests for the user

export default router;