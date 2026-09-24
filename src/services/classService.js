import mock from '../data/classes.json'

export const fetchClasses = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mock.classes), 150)
  })
}
