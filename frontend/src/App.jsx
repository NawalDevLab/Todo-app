import { useState, useCallback } from 'react'
import {
  DndContext, closestCenter, KeyboardSensor,
  PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove
} from '@dnd-kit/sortable'

import { LangProvider, useLang } from './context/LangContext'
import { useTodos } from './hooks/useTodos'
import TodoCard from './components/TodoCard'
import EditModal from './components/EditModal'
import Toast from './components/Toast'

function TodoApp() {
  const { lang, t, toggle: toggleLang } = useLang()

  // State
  const [filter, setFilter]           = useState('all')
  const [priorityFilter]              = useState('all')
  const [dark, setDark]               = useState(false)
  const [title, setTitle]             = useState('')
  const [desc, setDesc]               = useState('')
  const [priority, setPriority]       = useState('medium')
  const [editTodo, setEditTodo]       = useState(null)
  const [toast, setToast]             = useState(null)
  const [showDesc, setShowDesc]       = useState(false)

  const { todos, loading, stats, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } =
    useTodos(filter, priorityFilter)

  // Theme
  const handleDark = () => {
    setDark(d => {
      document.documentElement.setAttribute('data-theme', !d ? 'dark' : 'light')
      return !d
    })
  }

  // Toast helper
  const notify = useCallback((msg) => {
    setToast(msg)
  }, [])

  // Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = todos.findIndex(t => t.id === active.id)
    const newIndex = todos.findIndex(t => t.id === over.id)
    const newOrder = arrayMove(todos, oldIndex, newIndex)
    await reorderTodos(newOrder)
  }

  // Add
  const handleAdd = async () => {
    if (!title.trim()) return
    await addTodo({ title, description: desc, priority })
    setTitle(''); setDesc(''); setPriority('medium'); setShowDesc(false)
    notify(t.added)
  }

  // Toggle
  const handleToggle = async (id) => {
    await toggleTodo(id)
    notify(t.toggled)
  }

  // Delete
  const handleDelete = async (id) => {
    await deleteTodo(id)
    notify(t.deleted)
  }

  // Edit
  const handleSaveEdit = async (data) => {
    await updateTodo(editTodo.id, data)
    setEditTodo(null)
    notify(t.updated)
  }

  return (
    <div className="app">

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-left">
          <h1><span className="grad">{t.appName}</span></h1>
          <p>{t.appSub}</p>
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={toggleLang} title="Changer la langue">
            {lang === 'fr' ? '🇫🇷' : '🇬🇧'}
          </button>
          <button className="icon-btn" onClick={handleDark} title="Thème">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ── STATS ── */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--sky)' }}>{stats.total}</div>
          <div className="stat-label">{t.tasks}</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--mint)' }}>{stats.completed}</div>
          <div className="stat-label">{t.done}</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--coral)' }}>{stats.active}</div>
          <div className="stat-label">{t.remaining}</div>
        </div>
      </div>

      {/* ── ADD FORM ── */}
      <div className="add-form">
        <div className="form-row">
          <input
            className="form-input"
            placeholder={t.addPlaceholder}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            onFocus={() => setShowDesc(true)}
          />
        </div>
        {showDesc && (
          <textarea
            className="form-textarea"
            placeholder={t.descPlaceholder}
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        )}
        <div className="form-bottom">
          {['high','medium','low'].map(p => (
            <button
              key={p}
              className={`priority-btn ${p} ${priority === p ? 'active' : ''}`}
              onClick={() => setPriority(p)}
            >
              {t[p]}
            </button>
          ))}
          <button className="add-btn" onClick={handleAdd}>{t.add}</button>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="filters">
        {['all','active','completed'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {t[f]}
          </button>
        ))}
        <span className="filter-sep" />
        <span className="count-badge">{todos.length} {t.tasks}</span>
      </div>

      {/* ── TODO LIST ── */}
      {loading ? (
        <div className="empty">
          <div className="empty-icon">⏳</div>
          <h3>Chargement...</h3>
        </div>
      ) : todos.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">{filter === 'all' ? '📝' : '🎉'}</div>
          <h3>{filter === 'all' ? t.empty : t.emptyFiltered}</h3>
          <p>{filter === 'all' ? t.emptyDesc : ''}</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="todo-list">
              {todos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={setEditTodo}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* ── EDIT MODAL ── */}
      {editTodo && (
        <EditModal
          todo={editTodo}
          onSave={handleSaveEdit}
          onClose={() => setEditTodo(null)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <TodoApp />
    </LangProvider>
  )
}
