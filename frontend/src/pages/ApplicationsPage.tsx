import { FilePlus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DataTable } from '../shared/ui/DataTable'
import { PageHeader } from '../shared/ui/PageHeader'
import { Select } from '../shared/ui/Select'
import { StatusBadge } from '../shared/ui/StatusBadge'

export function ApplicationsPage() {
  const [status, setStatus] = useState('all')
  return (
    <>
      <PageHeader
        eyebrow="ОБРАЩЕНИЯ"
        title="Заявки"
        description="Потребность организаций в выпускниках БНТУ"
        action={
          <button className="primary">
            <FilePlus size={17} /> Новая заявка
          </button>
        }
      />
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input placeholder="Поиск по номеру, организации или специальности" />
        </div>
        <Select
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'Все статусы' },
            { value: 'review', label: 'На проверке' },
            { value: 'signed', label: 'Подписан' },
          ]}
        />
      </div>
      <DataTable
        columns={['Номер', 'Организация', 'Специальность', 'Количество', 'Статус', '']}
        rows={[
          [
            <Link className="table-link" to="/applications/1">
              З-2026/086
            </Link>,
            'ОАО «Беларуськалий»',
            'Программная инженерия',
            12,
            <StatusBadge status="REVIEW" />,
            <Link className="row-action" to="/applications/1">
              Открыть
            </Link>,
          ],
          [
            <span className="table-link">З-2026/084</span>,
            'ЗАО «Атлант»',
            'Электроэнергетика',
            6,
            <StatusBadge status="SIGNED" />,
            <button className="row-action">Открыть</button>,
          ],
          [
            <span className="table-link">З-2026/079</span>,
            'ОАО «Гродно Азот»',
            'Химическая технология',
            4,
            <StatusBadge status="DRAFT" />,
            <button className="row-action">Открыть</button>,
          ],
        ]}
      />
    </>
  )
}
