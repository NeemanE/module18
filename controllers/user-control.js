const { User } = require('../models');
const { Thought } = require('../models/Thought');

const userControl = {
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: ('-__v -username')
            })
            .populate({
                path: 'friends',
                select: ('-__v -thoughts')
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    
    getUserById({ params },res) {
        User.findOne({ _id: params.userID })
        .populate({
            path: 'thoughts',
            select: ('-__v -username')
        })
        .populate({
            path: 'friends',
            select: ('-__v -thoughts')
        })
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user associated with this ID' });
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },
   
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
  
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userID }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user associated with this ID.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
  
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userID })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user associated with this ID.' });
                    return;
                }
                return dbUserData;
            })
            .then(dbUserData => {
                User.updateMany(
                    { _id: { $in: dbUserData.friends } },
                    { $pull: { friends: params.userID } }
                )
                .then(()=> {
                    Thought.deleteMany({ username: dbUserData.username })
                    .then(() => {
                        res.json({message: 'User Deleted'});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
 
    createFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userID },
            { $addToSet: { friends: params.friendID } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user associated with this ID.'});
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userID },
            { $pull: { friends: params.friendID } },
            {new: true}
        )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user associated with this ID' });
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    }
};

module.exports = userControl;