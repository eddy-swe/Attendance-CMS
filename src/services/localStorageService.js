const KEY_PREFIX = 'sam_' // student attendance management

// Reads never throw: corrupted or unavailable storage is treated as "no data".
export const get = async (key) => {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Writes reject with a readable error so the UI can tell the user the save failed.
export const set = async (key, value) => {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    throw new Error('Could not save data in this browser (storage may be full or disabled).')
  }
}
