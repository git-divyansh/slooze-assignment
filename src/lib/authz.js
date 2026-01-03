export const Permissions = {
  VIEW_MENU: 'VIEW_MENU',
  CREATE_ORDER: 'CREATE_ORDER',      // add items to cart
  PLACE_ORDER: 'PLACE_ORDER',        // checkout & pay
  CANCEL_ORDER: 'CANCEL_ORDER',
  UPDATE_PAYMENT: 'UPDATE_PAYMENT',
}

const ROLE_PERMISSIONS = {
  ADMIN: new Set([
    Permissions.VIEW_MENU,
    Permissions.CREATE_ORDER,
    Permissions.PLACE_ORDER,
    Permissions.CANCEL_ORDER,
    Permissions.UPDATE_PAYMENT,
  ]),
  MANAGER: new Set([
    Permissions.VIEW_MENU,
    Permissions.CREATE_ORDER,
    Permissions.PLACE_ORDER,
    Permissions.CANCEL_ORDER,
  ]),
  MEMBER: new Set([
    Permissions.VIEW_MENU,
    Permissions.CREATE_ORDER,
  ]),
}

export function hasPermission(user, permission) {
  if (!user) return false
  const set = ROLE_PERMISSIONS[user.role]
  return set ? set.has(permission) : false
}

// Bonus: country scoping for data access
export function canAccessCountry(user, country) {
  if (!user) return false
  if (user.role === 'ADMIN') return true
  return user.country === country
}
