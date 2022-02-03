const { Schema, model} = require('mongoose')

const userSchema = new Schema(
    {
        username: {
            type: String, 
            required: true, unique: true, 
            trim:true
        },
        email: {type: String, 
            required: true, 
            unique: true, 
            validate: {
                validator: function(v) {
                return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
                },
                message: props => `${props.value} is not a valid email`
            }
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }  
        ]
    },
    {
        toJSON: {
          virtuals: true,
        },
        id: false,
    }
)

userSchema.virtual('friendCount').get(function () {
    return this.friends.length
})

const User = model("User", userSchema)

const handleError = (err) => console.error(err)

module.exports = User

/*

**User**:

* `username`
  * String
  * Unique
  * Required
  * Trimmed

* `email`
  * String
  * Required
  * Unique
  * Must match a valid email address (look into Mongoose's matching validation)

* `thoughts`
  * Array of `_id` values referencing the `Thought` model

* `friends`
  * Array of `_id` values referencing the `User` model (self-reference)
  * 
**Schema Settings**:

Create a virtual called `friendCount` that retrieves the length of the user's `friends` array field on query.
*/