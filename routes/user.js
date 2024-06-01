const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("post")
const User = mongoose.model("User")

router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .then((posts)=>{
             res.json({user,posts})
         })
         .catch(err=>{
             return res.status(422).json({error:err})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})
router.put('/follow',requireLogin,(req,res)=>{
    User.findOneAndUpdate({_id:req.body.followId},{
      $push:{followers:req.user._id}
   },{
         new:true
     })
     .then(result=>{
     console.log("result1 ",result)
         User.findOneAndUpdate({_id:req.user._id},{
         $push:{following:req.body.followId}

       }, {new:true}).select("-password").then(result2=>{
            console.log("result2 ",result2)
            res.json(result2)
       }).catch(err=>{
            console.log("Inner catch")
            return res.status(422).json({error:err})

       })

     })
     .catch(err=>{
            console.log("Outer catch ",err)
            return res.status(422).json({error:err})
     })


})
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findOneAndUpdate({_id:req.body.unfollowId},{
      $push:{followers:req.user._id}
   },{
         new:true
     })
     .then(result=>{
     console.log("result1 ",result)
         User.findOneAndUpdate({_id:req.user._id},{
         $push:{following:req.body.unfollowId}

       }, {new:true}).select("-password").then(result2=>{
            console.log("result2 ",result2)
            res.json(result2)
       }).catch(err=>{
            console.log("Inner catch")
            return res.status(422).json({error:err})

       })

     })
     .catch(err=>{
            console.log("Outer catch ",err)
            return res.status(422).json({error:err})
     })


})

router.put('/updatepic',requireLogin,(req,res)=>{
    User.findOneAndUpdate(req.user._id,{$set:{pic:req.body.pic}},
       {
            new:true
       }).then(result=>{
                res.json(result)
               console.log("result ", result)
     })
   .catch(err=>{
                return res.status(422).json({error:"pic cannot post"})
    })
   })

module.exports = router