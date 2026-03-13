import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'

export function useTodos(filter, priorityFilter) {
  const [todos, setTodos]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getAll(filter, priorityFilter)
      setTodos(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filter, priorityFilter])

  useEffect(() => { load() }, [load])

  const addTodo = async (todo) => {
    const created = await api.create(todo)
    setTodos(prev => [created, ...prev])
    return created
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id)
    const updated = await api.update(id, { completed: !todo.completed })
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  const updateTodo = async (id, data) => {
    const updated = await api.update(id, data)
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  const deleteTodo = async (id) => {
    await api.delete(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const reorderTodos = async (newOrder) => {
    setTodos(newOrder)
    await api.reorder(newOrder.map((t, i) => ({ id: t.id, position: i })))
  }

  const stats = {
    total:     todos.length,
    completed: todos.filter(t => t.completed).length,
    active:    todos.filter(t => !t.completed).length,
  }

  return { todos, loading, error, stats, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos, reload: load }
}
