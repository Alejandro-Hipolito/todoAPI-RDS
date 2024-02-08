const express = require('express')
const { createTodo, getTodos, hello, createTask, getTasks, getTask, editTask, deleteTask } = require('./controller')
const router = express.Router()


// router.post('/', createTodo) 
router.post('/create-task', createTask)

// router.get('/', getTodos)
// router.get('/hello', hello)

router.get('/tasks', getTasks )
router.get('/task/:id', getTask)


router.put('/task/:id', editTask)

router.delete('/task/:id', deleteTask)


module.exports = router;