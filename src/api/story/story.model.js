const { model, Schema } = require('mongoose')

module.exports = model(
  'Story',
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      storyLink: {
        type: String,
        required: true,
      },
      storyPublicId: {
        type: String,
        required: true,
      },
      created_at: {
        type: String,
      },
      expire_at: {
        type: Date,
        default: Date.now(),
        expires: 86400,
      },
    },
    { collection: 'story' }
  )
)
