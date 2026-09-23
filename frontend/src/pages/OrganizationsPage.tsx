import { ArrowUpRight, ChevronDown, ChevronRight, Folder, Plus, Search } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useModalAccessibility } from '../shared/hooks/useModalAccessibility'
import type { Organization } from '../shared/types'
import { PageHeader } from '../shared/ui/PageHeader'
import { Select } from '../shared/ui/Select'
import styles from './OrganizationsPage.module.css'

type RegistryRow = Organization & {
  faculty: string
  contractNumber: string
  endDate: string
  specialties: string
}

const rows: RegistryRow[] = [
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Автотракторный',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-27 01 01-02, 1-37 01 03, 1-36 01 07 · ещё 12',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Горного дела и инженерной экологии',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '6-05-0716-10',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Машиностроительный',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-36 01 03 02, 1-36 01 03 01 · ещё 4',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Механико-технологический',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-42 01 01-01, 1-36 01 06 · ещё 6',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Маркетинга, менеджмента, предпринимательства',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-25 01 07, 6-05-0311-02',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Энергетический',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-43 01 05, 1-43 01 03 · ещё 4',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Информационных технологий и робототехники',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-40 01 01, 1-40 05 01, 1-53 01 05 · ещё 5',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Энергетического строительства',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '7-07-0732-02',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Строительный',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-70 02 01, 1-07-0732-01',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Приборостроительный',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-38 02 01, 1-54 01 01-01 · ещё 4',
  },
  {
    id: 1,
    name: 'ОАО «МТЗ»',
    unp: '100307586',
    contact: 'Анна Ковалёва',
    contracts: 4,
    status: 'ACTIVE',
    faculty: 'Транспортных коммуникаций',
    contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
    endDate: '31.12.2030',
    specialties: '1-36 11 01-01',
  },
]

const facultyNames = [
  'Автотракторный',
  'Архитектурный',
  'Военно-технический',
  'Горного дела и инженерной экологии',
  'Инженерно-педагогический',
  'Информационных технологий и робототехники',
  'Маркетинга, менеджмента, предпринимательства',
  'Машиностроительный',
  'Международного сотрудничества',
  'Механико-технологический',
  'Приборостроительный',
  'Спортивно-технический',
  'Строительный',
  'Технологий управления и гуманитаризации',
  'Транспортных коммуникаций',
  'Энергетический',
  'Энергетического строительства',
]

type NewOrganizationForm = {
  shortName: string
  fullName: string
  legalAddress: string
  department: string
}

const initialNewOrganization: NewOrganizationForm = {
  shortName: '',
  fullName: '',
  legalAddress: '',
  department: '',
}

export function OrganizationsPage() {
  const [query, setQuery] = useState('')
  const [facultyQuery, setFacultyQuery] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('Все факультеты')
  const [year, setYear] = useState('Любой год окончания')
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [newOrganization, setNewOrganization] =
    useState<NewOrganizationForm>(initialNewOrganization)
  const createDialogRef = useModalAccessibility<HTMLFormElement>(
    () => setCreateModalOpen(false),
    isCreateModalOpen,
  )
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          (!query ||
            `${row.name} ${row.contractNumber}`.toLowerCase().includes(query.toLowerCase())) &&
          (selectedFaculty === 'Все факультеты' || row.faculty === selectedFaculty) &&
          (!facultyQuery || row.faculty.toLowerCase().includes(facultyQuery.toLowerCase())),
      ),
    [query, facultyQuery, selectedFaculty],
  )
  const resetFilters = () => {
    setQuery('')
    setFacultyQuery('')
    setSelectedFaculty('Все факультеты')
    setYear('Любой год окончания')
  }
  const goToStatistics = () =>
    document
      .getElementById('organization-stats')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const updateNewOrganization = (field: keyof NewOrganizationForm, value: string) =>
    setNewOrganization((current) => ({ ...current, [field]: value }))
  const saveNewOrganization = (event: FormEvent) => {
    event.preventDefault()
    setCreateModalOpen(false)
    setNewOrganization(initialNewOrganization)
  }

  return (
    <>
      <PageHeader
        eyebrow="РЕЕСТР"
        title="Организации"
        description="Компании-заказчики кадров и связанные с ними договоры"
        action={
          <div className={styles.actions}>
            <button className="secondary" type="button" onClick={goToStatistics}>
              К статистике
            </button>
            <button className="primary" type="button" onClick={() => setCreateModalOpen(true)}>
              <Plus size={17} /> Добавить организацию
            </button>
          </div>
        }
      />
      {isCreateModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCreateModalOpen(false)
          }}
        >
          <form
            ref={createDialogRef}
            className="new-organization-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-organization-title"
            tabIndex={-1}
            onSubmit={saveNewOrganization}
          >
            <h2 id="new-organization-title">Новая организация</h2>
            <label className="new-organization-field">
              Краткое наименование
              <input
                value={newOrganization.shortName}
                onChange={(event) => updateNewOrganization('shortName', event.target.value)}
                required
              />
            </label>
            <label className="new-organization-field">
              Полное наименование
              <input
                value={newOrganization.fullName}
                onChange={(event) => updateNewOrganization('fullName', event.target.value)}
                required
              />
            </label>
            <label className="new-organization-field">
              Юридический адрес
              <input
                value={newOrganization.legalAddress}
                onChange={(event) => updateNewOrganization('legalAddress', event.target.value)}
                required
              />
            </label>
            <label className="new-organization-field">
              Ведомство
              <input
                value={newOrganization.department}
                onChange={(event) => updateNewOrganization('department', event.target.value)}
              />
            </label>
            <button className="primary new-organization-submit" type="submit">
              Создать карточку
            </button>
          </form>
        </div>
      )}
      <section className={styles.registry}>
        <aside className={styles.facultyTree}>
          <div className={styles.facultyTitle}>ДЕРЕВО ФАКУЛЬТЕТОВ</div>
          <div className={styles.facultySearch}>
            <Search size={14} />
            <input
              value={facultyQuery}
              onChange={(event) => setFacultyQuery(event.target.value)}
              placeholder="Поиск в дереве"
            />
          </div>
          <button
            className={`${styles.facultyRoot} ${selectedFaculty === 'Все факультеты' ? styles.selected : ''}`}
            onClick={() => setSelectedFaculty('Все факультеты')}
          >
            <ChevronDown size={13} /> <span>Все факультеты</span>
            <b>{rows.length}</b>
          </button>
          {facultyNames
            .filter(
              (name) => !facultyQuery || name.toLowerCase().includes(facultyQuery.toLowerCase()),
            )
            .map((name) => (
              <button
                className={`${styles.facultyItem} ${selectedFaculty === name ? styles.selected : ''}`}
                key={name}
                onClick={() => setSelectedFaculty(name)}
              >
                <ChevronRight size={12} />
                <Folder size={13} />
                <span>{name}</span>
                <b>{rows.filter((row) => row.faculty === name).length}</b>
              </button>
            ))}
        </aside>
        <div className={styles.registryMain}>
          <div className={styles.toolbar}>
            <div className={styles.registrySearch}>
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Организация, номер или код специальности"
              />
            </div>
            <Select
              className="registry-filter-select"
              value={selectedFaculty}
              onChange={setSelectedFaculty}
              searchable
              searchPlaceholder="Поиск факультета"
              options={['Все факультеты', ...facultyNames].map((name) => ({
                value: name,
                label: name,
              }))}
            />
            <Select
              className="registry-filter-select registry-year-select"
              value={year}
              onChange={setYear}
              options={['Любой год окончания', '2030', '2029', '2028'].map((value) => ({
                value,
                label: value,
              }))}
            />
            <button className={styles.filterButton} type="button" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Организация</th>
                  <th>Факультет</th>
                  <th>Номер договора / действующая редакция</th>
                  <th>Статус</th>
                  <th>Дата окончания</th>
                  <th>Специальности факультета</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr
                    className={index === 6 ? styles.activeRow : ''}
                    key={`${row.faculty}-${index}`}
                  >
                    <td>
                      <Link to={`/organizations/${row.id}`} className={styles.organization}>
                        {row.name}
                        <ArrowUpRight size={12} />
                      </Link>
                    </td>
                    <td>{row.faculty}</td>
                    <td>{row.contractNumber}</td>
                    <td>
                      <span className={styles.status}>Активен</span>
                    </td>
                    <td>
                      <span className={styles.date}>{row.endDate}</span>
                    </td>
                    <td>{row.specialties}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <div id="organization-stats" className="stats" style={{ marginTop: 28 }}>
        <div>
          <span>Всего организаций</span>
          <strong>24</strong>
          <small className="positive">+3 за месяц</small>
        </div>
        <div>
          <span>Активные договоры</span>
          <strong>38</strong>
          <small>из 51 договора</small>
        </div>
        <div>
          <span>Требуют внимания</span>
          <strong className="accent-text">6</strong>
          <small>документов на проверке</small>
        </div>
      </div>
    </>
  )
}
