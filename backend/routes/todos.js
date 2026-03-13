const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/todoController');

router.get('/',           ctrl.getAllTodos);
router.post('/',          ctrl.createTodo);
router.put('/:id',        ctrl.updateTodo);
router.delete('/:id',     ctrl.deleteTodo);
router.patch('/reorder',  ctrl.reorderTodos);

module.exports = router