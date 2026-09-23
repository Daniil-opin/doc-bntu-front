import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './Select'

const options = [
  { value: 'first', label: 'Первый' },
  { value: 'second', label: 'Второй' },
  { value: 'third', label: 'Третий' },
]

describe('Select', () => {
  it('supports arrows, Home, End and keyboard selection', () => {
    const onChange = vi.fn()
    render(<Select value="first" options={options} onChange={onChange} name="Порядок" />)

    const trigger = screen.getByRole('button', { name: 'Первый' })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    const listbox = screen.getByRole('listbox', { name: 'Порядок' })
    fireEvent.keyDown(listbox, { key: 'End' })
    fireEvent.keyDown(listbox, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith('third')
    expect(trigger).toHaveFocus()
  })

  it('closes with Escape without changing the value', () => {
    const onChange = vi.fn()
    render(<Select value="first" options={options} onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: 'Первый' })
    fireEvent.keyDown(trigger, { key: 'Enter' })
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
    expect(trigger).toHaveFocus()
  })
})
