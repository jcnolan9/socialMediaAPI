const router = require('express').Router();
const { User, Thought } = require('./../../models')


router.get('/', (req, res) => {
    Thought.find()
        .then((Thought) => res.json(Thought))
        .catch((err) => res.status(500).json(err))
})

router.post('/', (req, res) => {
    Thought.create(req.body)
        .then((thought) => {
           return User.findOneAndUpdate(
                {username: req.body.username},
                {$addToSet: { thoughts: thought._id} },
                { new : true }
            )
        })
        .then((user) => {
            !user
                ? res
                    .status(404)
                    .json({ message: 'Thought created, but found no user with that ID' })
                : res.json('Created the thought 🎉')
        })
        .catch((err) => res.status(500).json(err))
})


router.get('/:thoughtId', (req, res) => {
    Thought.findOne({_id: req.params.thoughtId})
        .select('-__v')
        .populate('reactions')
        .then((thought) => !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought))
        .catch((err) => res.status(500).json(err))
})


router.put('/:thoughtId', (req, res) => {
    Thought.findByIdAndUpdate(req.params.thoughtId,
        {
            $set: {
                thoughtText: req.body.thoughtText, 
            }
        }
    )
    .then((thought) => 
        !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought) 
    )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.delete('/:thoughtId', (req, res) => {
    Thought.deleteOne({_id: req.params.thoughtId})
        .then((thought) => 
            !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json({message: 'Thought successfully deleted'})
    )
    .catch((err) => res.status(500).json(err))
})


router.post('/:thoughtId/reactions', (req, res) => {
    Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$addToSet: { reactions: req.body} },
        { new : true }
    )
    .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought with that ID' })
          : res.json('Created the reaction 🎉')
      )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
    Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$pull: {reactions:{_id: req.params.reactionId} }}
        /*
            this is different than deleting a friend from a user because the reactions
            are just a schema and not an actual model. Have to be more specific and put the
            "_id:" before the req.params.reactionId
        */
    )
    .then((thought) => 
        !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought.reactions) 
    )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

/*
`GET` to get all thoughts

* `GET` to get a single thought by its `_id`

* `POST` to create a new thought (don't forget to push the created thought's `_id` to the associated user's `thoughts` array field)

```json
// example data
{
  "thoughtText": "Here's a cool thought...",
  "username": "lernantino",
  "userId": "5edff358a0fcb779aa7b118b"
}
```

* `PUT` to update a thought by its `_id`

* `DELETE` to remove a thought by its `_id`

---

**`/api/thoughts/:thoughtId/reactions`**

* `POST` to create a reaction stored in a single thought's `reactions` array field

* `DELETE` to pull and remove a reaction by the reaction's `reactionId` value

*/

module.exports = router;