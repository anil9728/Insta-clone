const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("post")
const User = mongoose.model("User")

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy",{name:1})
    .populate("comments.postedBy","_id name")
    .then(posts=>{
         res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy",{name:1})
    .populate("comments.postedBy","_id name")
    .then(posts=>{
         res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body||!pic){

        return res.status(422).json({error:"please add all the fields"})
}

req.user.password = undefined
const post = new Post({
    title,
    body,
    photo:pic,
    postedBy:req.user
})
post.save().then(result=>{
res.json({post:result})
})
.catch(err=>{
console.log(err)
})
})
router.get('/mypost',requireLogin,(req,res)=>{
Post.find({postedBy:req.user._id})
.populate("postedBy","_id name")
.then(mypost=>{
res.json({mypost})
})
.catch(err=>{
console.log(err)
})
})

router.post('/like',requireLogin,(req,res)=>{
var postId = req.body.postId
let postId2 = postId.trim()
console.log("req.body.postId=",postId2)
          Post.findByIdAndUpdate(req.body.postId,{
          $push:{likes:req.user._id}
      },{
           new:true
      })
      .then((result)=>{
           return res.json(result)
      })
      .catch((err)=>{
            return res.status(422).json({error:err})
      })

})

router.post('/unlike',requireLogin,(req,res)=>{
var postId = req.body.postId
let postId2 = postId.trim()
console.log("req.body.postId=",postId2)
          Post.findByIdAndUpdate(req.body.postId,{
          $pull:{likes:req.user._id}
      },{
           new:true
      })
      .then((result)=>{
           return res.json(result)
      })
      .catch((err)=>{
            return res.status(422).json({error:err})
      })

})
router.put('/comment',requireLogin,(req,res)=>{
      const comment ={
              text:req.body.text,
              postedBy:req.user._id
      }
      Post.findByIdAndUpdate(req.body.postId,{
      $push:{comments:comment}
      },{
      new:true
      })
      .populate("comments.postedBy","_id name")
      .populate("postedBy","_id name")
      .then((result)=>{
                 return res.json(result)
       })
       .catch((err)=>{
                return res.status(422).json({error:err})
       })

})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then((post)=>{
    console.log("post ", post)
        if(!post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            Post.deleteOne({_id:req.params.postId})
                        .then(result=>{
                            return res.json({message:"Successfully deleted"})

                        }).catch(err=>{
                            return res.status(422).json({error:err})
                        })
        }

    })
    .catch((err)=>{
        return res.status(422).json({error:err})
    })



})

module.exports = router