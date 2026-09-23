import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { type Column, DataTable } from './DataTable'

type User = { id: number; name: string }

describe('DataTable', () => {
  it('renders typed items through typed columns', () => {
    const columns: Column<User>[] = [
      { key: 'name', header: 'Сотрудник', render: (user) => user.name },
    ]

    render(
      <DataTable
        items={[{ id: 1, name: 'Мария Соколова' }]}
        columns={columns}
        getRowKey={(user) => user.id}
      />,
    )

    expect(screen.getByRole('columnheader', { name: 'Сотрудник' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Мария Соколова' })).toBeInTheDocument()
  })

  it('renders an empty state', () => {
    render(
      <DataTable
        items={[]}
        columns={[{ key: 'name', header: 'Сотрудник', render: () => null }]}
        getRowKey={() => 1}
      />,
    )

    expect(screen.getByText('Нет данных')).toBeInTheDocument()
  })
})
