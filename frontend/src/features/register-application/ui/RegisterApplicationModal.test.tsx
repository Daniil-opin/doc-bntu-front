import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { type ApplicationForm, RegisterApplicationModal } from './RegisterApplicationModal'

describe('RegisterApplicationModal', () => {
  it('updates the application number and closes through callbacks', () => {
    const application: ApplicationForm = {
      receivedDate: '',
      number: '',
      signedDate: '',
      faculties: [],
    }
    const onChange = vi.fn()
    const onClose = vi.fn()

    render(
      <RegisterApplicationModal
        application={application}
        organizationName="ОАО «МТЗ»"
        onChange={onChange}
        onClose={onClose}
        onSave={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText('Номер заявки'), { target: { value: 'З-2026/001' } })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }))

    expect(onChange).toHaveBeenCalledWith({ ...application, number: 'З-2026/001' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('exposes dialog semantics, traps focus and closes with Escape', () => {
    const onClose = vi.fn()
    render(
      <RegisterApplicationModal
        application={{ receivedDate: '', number: '', signedDate: '', faculties: [] }}
        organizationName="ОАО «МТЗ»"
        onChange={vi.fn()}
        onClose={onClose}
        onSave={vi.fn()}
      />,
    )

    const dialog = screen.getByRole('dialog', { name: 'Зарегистрировать заявку' })
    const closeButton = screen.getByRole('button', { name: 'Закрыть' })
    const submitButton = screen.getByRole('button', { name: 'Зарегистрировать заявку' })

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    submitButton.focus()
    fireEvent.keyDown(submitButton, { key: 'Tab' })
    expect(closeButton).toHaveFocus()

    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
