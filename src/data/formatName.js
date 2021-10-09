export const formatName = (user) => {
  if (user.firstName && user.name) {
    return user.name
  }
  if (user.firstName) {
    return user.firstName
  }
  if (user.username) {
    return user.username
  }

  return user.email
}
