import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ApplicationsPage } from './ApplicationsPage'

function renderPage(path = '/applications') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ApplicationsPage />
    </MemoryRouter>,
  )
}

async function waitForRegistry() {
  return screen.findByRole('link', { name: 'З-2026/086' })
}

describe('ApplicationsPage', () => {
  it('renders registry records and scan states', async () => {
    renderPage()

    await waitForRegistry()

    expect(screen.getByText('Найдено заявок:')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Скачать скан заявки З-2026/086' })).toHaveAttribute(
      'href',
      expect.stringContaining('data:text/plain'),
    )
    expect(screen.getAllByText('Нет скана')).toHaveLength(1)
  })

  it('filters by application number after form submit', async () => {
    renderPage()
    await waitForRegistry()

    fireEvent.change(screen.getByPlaceholderText('Номер заявки или организация'), {
      target: { value: '  з-2026/084  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Фильтровать' }))

    expect(screen.getByRole('link', { name: 'З-2026/084' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'З-2026/086' })).not.toBeInTheDocument()
  })

  it('filters by organization and supports Enter form submission', async () => {
    renderPage()
    await waitForRegistry()

    fireEvent.change(screen.getByPlaceholderText('Номер заявки или организация'), {
      target: { value: 'Гродно Азот' },
    })
    fireEvent.submit(screen.getByRole('form', { name: 'Фильтры заявок' }))

    expect(screen.getByRole('link', { name: 'З-2026/079' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'З-2026/086' })).not.toBeInTheDocument()
  })

  it('filters by faculty and status together', async () => {
    renderPage()
    await waitForRegistry()

    fireEvent.click(screen.getByRole('button', { name: 'Факультет' }))
    fireEvent.click(screen.getByRole('option', { name: 'Машиностроительный' }))
    fireEvent.click(screen.getByRole('button', { name: 'Статус' }))
    fireEvent.click(screen.getByRole('option', { name: 'Подписан' }))
    fireEvent.click(screen.getByRole('button', { name: 'Фильтровать' }))

    expect(screen.getByRole('link', { name: 'З-2026/071' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'З-2026/084' })).not.toBeInTheDocument()
  })

  it('shows an empty state and resets filters', async () => {
    renderPage()
    await waitForRegistry()

    fireEvent.change(screen.getByPlaceholderText('Номер заявки или организация'), {
      target: { value: 'несуществующая заявка' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Фильтровать' }))

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(screen.getByRole('link', { name: 'З-2026/086' })).toBeInTheDocument()
  })

  it('restores applied filters from the URL', async () => {
    renderPage('/applications?status=SIGNED')
    await screen.findByRole('link', { name: 'З-2026/084' })

    expect(screen.getByRole('link', { name: 'З-2026/071' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'З-2026/086' })).not.toBeInTheDocument()
  })
})
