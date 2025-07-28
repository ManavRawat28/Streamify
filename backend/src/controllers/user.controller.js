import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId=req.user.id;
        const currentUser=req.user;

        const recommendedUsers=await User.find(
            {
                $and:[
                    {_id:{$ne:currentUserId}}, // Exclude current user
                    {_id:{$nin:currentUser.friends}},// Exclude friends of current user
                    {isOnboarded:true} // Only include users who have completed onboarding
                ]
            } )
            res.status(200).json(recommendedUsers);

    } catch (error) {
        console.log('Error in getRecommendedUsers', error.message);
        res.status(500).json( {message:'Internal Server Error'});
    }
}
export async function getMyFriends(req, res) {
    try {

        const user=await User.findById(req.user.id)
        .select('friends')
        .populate('friends',"fullName profilePic nativeLanguage learningLanguage ");
        res.status(200).json(user.friends);

    } catch (error) {
        
        console.log('Error in getMyFriends', error.message);
        res.status(500).json({message:'Internal Server Error'});

    }
}

export async function sendFriendRequest(req, res) {
    try {
        
        const myId=req.user.id;
        const{id:recipientId}=req.params // jis ki id ko req bhejni h
        
        // prevent sending req to self
        if(myId==recipientId){
            return res.status(400).json({message:'You cannot send a friend request to yourself.'});
        }
        
        const recipient=await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:'recipient not found.'});
        }

        // check if already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:'You are already friends with this user.'});
        }

        // check if already sent a request

        const existingRequest= await FriendRequest.findOne({ 
            $or: [
                { sender: myId, recipient: recipientId },  
                { sender: recipientId, recipient: myId }
            ] // why beacuse schema dekh pta chl jaega ye query kyu likhi
        })

        if(existingRequest){
            return res
            .status(400)
            .json({message:'Friend request request already exist between you and this user.'});
        }

        // create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })
        res.status(201).json(friendRequest);

    } catch (error) {
        console.log('Error in sendFriendRequest', error.message);
        res.status(500).json({message:'Internal Server Error'});
    }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;  // dusri ki id

    // check if request exists
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    // check if request is for current user
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to accept this friend request.' });
    }

    // accept the friend request
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // add each other to friends list
    await User.findByIdAndUpdate(
      friendRequest.recipient,
      { $addToSet: { friends: friendRequest.sender } }, // ensures no duplicates
    );

    await User.findByIdAndUpdate(
      friendRequest.sender,
      { $addToSet: { friends: friendRequest.recipient } }, // ✅ FIXED: use correct recipient
    );

    res.status(200).json({ message: 'Friend request accepted successfully.' });

  } catch (error) {
    console.log('Error in acceptFriendRequest', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: 'pending',
    }).populate('sender', 'fullName profilePic nativeLanguage learningLanguage');

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: 'accepted',
    }).populate('recipient', 'fullName profilePic nativeLanguage learningLanguage');

    res.status(200).json({ incomingReqs, acceptedReqs });

  } catch (error) {
    console.log('Error in getFriendRequests', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


export async function getOutgoingFriendReqs(req, res){
   
    try {
        
        const outgoingFriendReqs= await FriendRequest.find({
         sender: req.user.id,
         status: 'pending'
         }).populate('recipient', 'fullName profilePic nativeLanguage learningLanguage');

       res.status(200).json({ outgoingFriendReqs });

    } catch (error) {
        console.log('Error in getOutgoingFriendReqs', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
