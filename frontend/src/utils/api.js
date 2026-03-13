const BASE = '/api/todos'

export const api = {
  getAll: async (filter = 'all', priority = 'all') => {
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('filter', filter)
    if (priority !== 'all') params.set('priority', priority)
    const res = await fetch(`${BASE}?${params}`)
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return data.data
  },

  create: async (todo) => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return data.data
  },

  update: async (id, updates) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return data.data
  },

  delete: async (id) => {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return true
  },

  reorder: async (items) => {
    const res = await fetch(`${BASE}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    return true
  }
}
