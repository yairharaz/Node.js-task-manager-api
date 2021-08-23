const express = require('express')
const sharp = require('sharp')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { upload } = require('../middleware/upload')
const router = new express.Router()


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Filtering by query string  GET /tasks?completed=true
// Paginating: GET /tasks?limit=10&skip=
// Sorting: GET /tasks?sortBy=createdAt_asc    or     GET /tasks?sortBy=createdAt:asc

router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //   OPTION I:
        // const tasks = await Task.find({owner: req.user._id})
        // res.send(tasks)

        //   OPTION II:
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOparation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOparation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/tasks/:id/image', auth, upload.single('taskImage'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 250 }).png().toBuffer()
    const _id = req.params.id
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
        return res.status(404).send()
    }

    task.image = buffer

    await task.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


module.exports = router