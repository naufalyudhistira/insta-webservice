const imageService = require('./image.service')
const userService = require('../user/user.service')
const followService = require('../follow/follow.service')
const likeService = require('../like/like.service')

module.exports = {
  index: async (req, res) => {
    try {
      const imageRes = await imageService.getAllImage()
      res.json(imageRes)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  show: async (req, res) => {
    try {
      let imageRes = await imageService.getImageById(req.params.id)
      res.json(imageRes)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  user: async (req, res) => {
    try {
      const imageRes = await imageService.getImageByUsername(
        req.params.username
      )
      res.json(imageRes)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  following: async (req, res) => {
    try {
      let followingPosts = []
      let newData = []
      const following = await followService.getFollowingPerUser(req.user.id)
      const self = await imageService.getImageByUserId(req.user.id)
      const isLiked = await likeService.getLikeByUserLoggedIn(req.user.id)

      self.map((data) => {
        followingPosts.push(data)
      })
      following.map(async (data) => {
        const a = await imageService.getImageByUserId(data.user._id)
        a.map((data) => {
          followingPosts.push(data)
        })
      })
      setTimeout(() => {
        followingPosts.map((data) => {
          isLiked.map((like) => {
            let a = JSON.stringify(data._id)
            let b = JSON.stringify(like.image._id)
            let likedByMe = a == b ? true : false
            let pair = { isLiked: likedByMe }
            data = { ...data._doc, ...pair }
            newData.push(data)
          })
        })
      }, 1000)
      setTimeout(() => {
        res.json(newData)
      }, 2000)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  store: async (req, res) => {
    try {
      const imageBuffer = req.file.buffer
      const imageRes = await imageService.postImage(
        req.user.id,
        req.body.caption,
        imageBuffer
      )
      if (imageRes) {
        await userService.incrementPost(req.user.id)
        res.json(imageRes)
      }
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  update: async (req, res) => {
    try {
      const imageRes = await imageService.updateCaption(
        req.body.caption,
        req.params.id
      )
      res.json(imageRes)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  delete: async (req, res) => {
    try {
      const imageRes = await imageService.deleteImage(req.params.id)
      if (imageRes) {
        await userService.decrementPost(req.user.id)
        res.json(imageRes)
      }
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  liked: async (req, res) => {
    try {
      const imageRes = await imageService.incrementLike(req.params.id)
      console.log(req.user.id)

      if (imageRes)
        await likeService.storeLikeImage(imageRes[0]._id, req.user.id)
      res.json(imageRes)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  unliked: async (req, res) => {
    try {
      const imageRes = await imageService.decrementLike(req.params.id)
      res.json(imageRes)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },

  viewed: async (req, res) => {
    try {
      const imageRes = await imageService.incrementView(req.params.id)
      res.json(imageRes)
    } catch (error) {
      res.status(error.statusCode || 500).json(error)
    }
  },
}
