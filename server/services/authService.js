
export function isAdmin(user) {
  if (user.role === 'admin') {
    return true
  }
  return false
}

export default isAdmin;