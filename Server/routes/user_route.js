const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
var bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const protectedRoute = require('../middleware/protectedResource');

// new registration
router.post('/register', (req, res) => {
    const { name, email, username, password, profileimg, dob, location } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: "All * fields required!" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "Email already registered" });
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ name, username, email, dob, location, password: hashedPassword, profileimg });
                    user.save()
                        .then((newuser) => {
                            res.status(201).json({ result: newuser });
                        })
                        .catch((err) => {
                            console.log("Signup err", err);
                        })
                })
        })

        .catch((err) => {
            console.log(err);
        });
});

//login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All * fields required!" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(500).json({ error: "User doesn't exist!" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "email": userInDB.email, "fullname": userInDB.fullname };
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid credentials!" })
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        });
});

//get user
router.get("/api/user/:id", protectedRoute, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            res.status(400).json({ error: "User doesnt exist" })
        }
        res.status(200).json({ currentuser: user })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error })
    }
})

//update user details
router.put("/api/updateuser/:id", protectedRoute, async (req, res) => {
    try {
        const { name, dob, location } = req.body;
        const user = await UserModel.findOneAndUpdate({ _id: req.params.id }, { name, dob, location }, { new: true });
        if (user) {
            res.status(200).json({
                message: 'User updated'
            });
        } else {
            console.log("error");
        }
    } catch (error) {
        console.error("Some error occurred", error);
        res.status(500).json({
            error: "Some error occured",
        });
    }
});

//follow user
router.put("/api/user/follow/:id", protectedRoute, async (req, res) => {
    try {
        const userToFollow = await UserModel.findById(req.params.id);
        const currentUser = await UserModel.findById(req.body.id);
        if (userToFollow._id === currentUser._id) {
            return res.status(403).json("You cannot follow yourself");
        }
        //condition to check if the current user is already following user
        if (!userToFollow.followers.includes(req.body.id)) {
            await userToFollow.updateOne({
                $push: { followers: req.body.id },
            });
            await currentUser.updateOne({ $push: { following: req.params.id } });
        } else {
            return res.status(400).json("You already follow this user");
        }
        return res.status(200).json({ success: true, message: "Followed User Successfully" });
    } catch (error) {
        console.error("Error while Following User:", error);
        res.status(500).json({
            error:
                "An error occurred during following the User. Please try again later.",
        });
    }
});

//unfollow user
router.put("/api/user/unfollow/:id", protectedRoute, async (req, res) => {
    try {
        const currentUser = await UserModel.findById(req.body.id);
        const userToUnfollow = await UserModel.findById(req.params.id);
        if (userToUnfollow._id === currentUser._id) {
            return res.status(400).json("You cannot unfollow yourself");
        }
        if (currentUser.following.includes(req.params.id)) {
            // Update the user to unfollow's followers array
            await userToUnfollow.updateOne({
                $pull: { followers: req.body.id },
            });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
        } else {
            return res.status(400).json("You are not following this user");
        }
        return res.status(200).json({ success: true, message: "Unfollowed User Successfully" });
    } catch (error) {
        console.error("Error while Unfollowing User:", error);
        res.status(500).json({
            error:
                "Some error occurred. Please try again later.",
        });
    }
});

module.exports = router;