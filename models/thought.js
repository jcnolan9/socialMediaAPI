const { Schema, model } = require('mongoose')

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId
    },
    reactionBody: {
        type: String,
        required: true,
        max: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now,
    }
})

reactionSchema.methods.getDate = function () {
    const myDate = new Date(this.createdAt)
    return `${myDate.getMonth()} - ${myDate.getDate()} - ${myDate.getYear()}`
}


const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true, 
            unique: true, 
            min: 1,
            max: 280
        },
        createdAt: {
            type: Date, 
            default: Date.now,
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
          virtuals: true,
        },
        id: false,
    }
)

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length
})

thoughtSchema.methods.getDate = function () {
    const myDate = new Date(this.createdAt)
    return `${myDate.getMonth()} - ${myDate.getDate()} - ${myDate.getYear()}`
}

const Thought = model("Thought", thoughtSchema)

const handleError = (err) => console.error(err)

module.exports = Thought

/*
*Thought**:

* `thoughtText`
  * String
  * Required
  * Must be between 1 and 280 characters

* `createdAt`
  * Date
  * Set default value to the current timestamp
  * Use a getter method to format the timestamp on query

* `username` (The user that created this thought)
  * String
  * Required

* `reactions` (These are like replies)
  * Array of nested documents created with the `reactionSchema`

**Schema Settings**:

Create a virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.

**Reaction** (SCHEMA ONLY)

* `reactionId`
  * Use Mongoose's ObjectId data type
  * Default value is set to a new ObjectId

* `reactionBody`
  * String
  * Required
  * 280 character maximum

* `username`
  * String
  * Required

* `createdAt`
  * Date
  * Set default value to the current timestamp
  * Use a getter method to format the timestamp on query

**Schema Settings**:

This will not be a model, but rather will be used as the `reaction` field's subdocument schema in the `Thought` model.
*/