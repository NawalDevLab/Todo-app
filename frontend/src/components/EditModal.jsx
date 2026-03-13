import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'

export default function EditModal({ todo, onSave, onClose }) {
  const { t } = useLang()
  const [title, setTitle]       = useState(todo.title)
  const [desc, setDesc]         = useState(todo.description || '')
  const [priority, setPriority] = useState(todo.priority)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), description: desc.trim(), priority })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{t.editTitle}</h2>

        <input
          className="form-input"
          style={{ width: '100%', marginBottom: '0.75rem' }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />

        <textarea
          className="form-textarea"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder={t.descPlaceholder}
        />

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
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>{t.cancel}</button>
          <button className="btn-save" onClick={handleSave}>{t.save}</button>
        </div>
      </div>
    </div>
  )
}
