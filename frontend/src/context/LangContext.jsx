import { createContext, useContext, useState } from 'react'

const translations = {
  fr: {
    appName: 'TaskFlow',
    appSub: 'Gestionnaire de tâches',
    all: 'Toutes',
    active: 'En cours',
    completed: 'Terminées',
    tasks: 'tâches',
    done: 'terminées',
    remaining: 'en cours',
    addPlaceholder: 'Nouvelle tâche...',
    descPlaceholder: 'Description (optionnel)',
    add: '+ Ajouter',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
    priority: 'Priorité',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    editTitle: 'Modifier la tâche',
    empty: 'Aucune tâche',
    emptyDesc: 'Ajoutez votre première tâche ci-dessus !',
    emptyFiltered: 'Aucune tâche dans ce filtre',
    added: '✅ Tâche ajoutée !',
    deleted: '🗑️ Tâche supprimée',
    updated: '✏️ Tâche modifiée',
    toggled: '✔️ Statut mis à jour',
  },
  en: {
    appName: 'TaskFlow',
    appSub: 'Task Manager',
    all: 'All',
    active: 'Active',
    completed: 'Done',
    tasks: 'tasks',
    done: 'done',
    remaining: 'active',
    addPlaceholder: 'New task...',
    descPlaceholder: 'Description (optional)',
    add: '+ Add',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    priority: 'Priority',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    editTitle: 'Edit task',
    empty: 'No tasks yet',
    emptyDesc: 'Add your first task above!',
    emptyFiltered: 'No tasks match this filter',
    added: '✅ Task added!',
    deleted: '🗑️ Task deleted',
    updated: '✏️ Task updated',
    toggled: '✔️ Status updated',
  }
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('fr')
  const t = translations[lang]
  const toggle = () => setLang(l => l === 'fr' ? 'en' : 'fr')
  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
