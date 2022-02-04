const router = require('express').Router();
const { User } = require('../../models')


router.get('/', (req, res) => {
    console.log("hello")
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err))
})

router.post('/', (req, res) => {
    console.log(req.body)
    User.create(req.body)
        .then((userData) => {
            console.log(userData)
            res.json(userData)
        })
        .catch((err) => res.status(500).json(err))
})


router.get('/:userId', (req, res) => {
    User.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
        .then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user))
        .catch((err) => res.status(500).json(err))
})


router.put('/:userId', (req, res) => {
    User.findByIdAndUpdate(req.params.userId,
        {
            $set: {
                username: req.body.username, 
                email: req.body.email
            }
        }
    )
    .then((user) => 
        !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user) 
    )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.delete('/:userId', (req, res) => {
    User.deleteOne({_id: req.params.userId})
        .then((user) => 
            !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json({message: 'User successfully deleted'})
    )
    .catch((err) => res.status(500).json(err))
})


router.post('/:userId/friends/', (req, res) => {
    User.create(req.body)
        .then((friend) => {
            return User.findOneAndUpdate(
                {_id: req.params.userId},
                {$addToSet: { friends: friend._id} },
                { new : true }
            )
        })
        .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'Post created, but found no user with that ID' })
          : res.json('Created the post 🎉')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
})

router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId }}
    )
        .then((user) => 
            !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json({message: 'Succesfully deleted friend'}) 
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
        
})



/*
GET` all users

* `GET` a single user by its `_id` and populated thought and friend data

* `POST` a new user:

```json
// example data
{
  "username": "lernantino",
  "email": "lernantino@gmail.com"
}
```

* `PUT` to update a user by its `_id`

* `DELETE` to remove user by its `_id`

**BONUS**: Remove a user's associated thoughts when deleted.

---

**`/api/users/:userId/friends/:friendId`**

* `POST` to add a new friend to a user's friend list

* `DELETE` to remove a friend from a user's friend list

*/

module.exports = router;