const router = require('express').Router();
const { users, thoughts } = require('./../../models')


router.get('/', (req, res) => {
    thoughts.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err))
})

router.post('/', (req, res) => {
    thoughts.create(req.body)
        .then((thought) => {
           return users.findOneAndUpdate(
                {username: thought.username},
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
    thoughts.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('reactions')
        .then((thought) => !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought))
        .catch((err) => res.status(500).json(err))
})


router.put('/:thoughtId', (req, res) => {
    thoughts.findByIdAndUpdate(req.params.thought,
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
    thoughts.deleteOne({_id: req.params.thoughtId})
        .then((thought) => 
            !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json({message: 'Thought successfully deleted'})
    )
    .catch((err) => res.status(500).json(err))
})


router.post('/:thoughtId/reactions', (req, res) => {
    thoughts.findOneAndUpdate(
        {_id: req.body.thoughtId},
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

router.delete('/:thoughtId/reactionId', (req, res) => {
    thoughts.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$pull: {reactions: req.params.reactionId }}
)
    .then((thought) => 
        !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought) 
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