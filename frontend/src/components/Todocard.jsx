import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useLang } from '../context/LangContext'

const PRIORITY_EMOJI = { high: '🔴', medium: '🟡', low: '🟢' }

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const { t } = useLang()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`todo-card ${todo.priority} ${todo.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      {/* Drag handle */}
      <span className="drag-handle" {...attributes} {...listeners} title="Déplacer">⠿</span>

      {/* Checkbox */}
      <button
        className={`check-btn ${todo.completed ? 'done' : ''}`}
        onClick={() => onToggle(todo.id)}
        title={todo.completed ? 'Marquer active' : 'Marquer terminée'}
      >
        {todo.completed ? '✓' : ''}
      </button>

      {/* Content */}
      <div className="todo-body">
        <p className="todo-title">{todo.title}</p>
        {todo.description && <p className="todo-desc">{todo.description}</p>}
        <div className="todo-meta">
          <span className={`priority-badge ${todo.priority}`}>
            {PRIORITY_EMOJI[todo.priority]} {t[todo.priority]}
          </span>
          <span className="todo-date">{formatDate(todo.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="todo-actions">
        <button className="action-btn" onClick={() => onEdit(todo)} title={t.edit}>✏️</button>
        <button className="action-btn delete" onClick={() => onDelete(todo.id)} title={t.delete}>🗑️</button>
      </div>
    </div>
  )
}
