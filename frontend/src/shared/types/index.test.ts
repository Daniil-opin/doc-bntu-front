import { describe, expect, it } from 'vitest'

import { USER_ROLE_LABELS, UserRole } from './index'

describe('user role domain values', () => {
  it('keeps stable codes separate from display labels', () => {
    expect(UserRole.ADMIN).toBe('ADMIN')
    expect(USER_ROLE_LABELS[UserRole.ADMIN]).toBe('Администратор')
  })
})
