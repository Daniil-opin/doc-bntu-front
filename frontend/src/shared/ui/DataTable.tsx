import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
}

interface TypedDataTableProps<T> {
  items: T[]
  columns: Column<T>[]
  getRowKey: (item: T) => string | number
  empty?: string
}

interface LegacyDataTableProps {
  columns: string[]
  rows: ReactNode[][]
  empty?: string
}

export function DataTable<T>(props: TypedDataTableProps<T> | LegacyDataTableProps) {
  if ('items' in props) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {props.columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.items.length ? (
              props.items.map((item) => (
                <tr key={props.getRowKey(item)}>
                  {props.columns.map((column) => (
                    <td key={column.key}>{column.render(item)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty" colSpan={props.columns.length}>
                  {props.empty ?? 'Нет данных'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.length ? (
            props.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty" colSpan={props.columns.length}>
                {props.empty ?? 'Нет данных'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
