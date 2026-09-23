import type { ReactNode } from 'react'

export function DataTable({ columns, rows, empty = 'Нет данных' }: { columns: string[]; rows: ReactNode[][]; empty?: string }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <tr><td className="empty" colSpan={columns.length}>{empty}</td></tr>}</tbody></table></div>
}
