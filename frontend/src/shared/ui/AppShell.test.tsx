import '../../styles.css'

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Providers } from '../../app/providers'
import { AppShell } from './AppShell'

describe('AppShell content layout', () => {
  beforeEach(() => {
    localStorage.setItem('bntu-auth', '1')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('uses a wider bounded content area with reduced desktop side padding', () => {
    render(
      <MemoryRouter>
        <Providers>
          <AppShell>
            <p>Содержимое страницы</p>
          </AppShell>
        </Providers>
      </MemoryRouter>,
    )

    const content = screen.getByText('Содержимое страницы').closest('section')
    expect(content).toHaveClass('content')

    const tokens = getComputedStyle(document.documentElement)
    expect(tokens.getPropertyValue('--content-max-width').trim()).toBe('1600px')
    expect(tokens.getPropertyValue('--content-padding-block').trim()).toBe('40px')
    expect(tokens.getPropertyValue('--content-padding-inline').trim()).toBe('32px')
  })
})
