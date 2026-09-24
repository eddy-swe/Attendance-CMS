const KEY_PREFIX = 'sam_' // student attendance management

export const get = (key) => {
  return new Promise((resolve) => {
    const raw = localStorage.getItem(KEY_PREFIX + key)
    resolve(raw ? JSON.parse(raw) : null)
  })
}

export const set = (key, value) => {
  return new Promise((resolve) => {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value))
    resolve(true)
  })
}
