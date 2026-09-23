import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CreateContractForm } from './CreateContractForm'

describe('CreateContractForm', () => {
  it('shows validation errors before submitting an empty form', async () => {
    const onSubmit = vi.fn()

    render(<CreateContractForm faculties={['Автотракторный']} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }))

    await waitFor(() => expect(screen.getByText('Введите номер договора')).toBeInTheDocument())
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
