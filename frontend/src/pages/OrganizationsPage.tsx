import { ArrowUpRight, ChevronDown, ChevronRight, Folder, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../shared/ui/PageHeader'
import type { Organization } from '../shared/types'

type RegistryRow = Organization & { faculty: string; contractNumber: string; endDate: string; specialties: string }

const rows: RegistryRow[] = [
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Автотракторный', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-27 01 01-02, 1-37 01 03, 1-36 01 07 · ещё 12' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Горного дела и инженерной экологии', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '6-05-0716-10' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Машиностроительный', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-36 01 03 02, 1-36 01 03 01 · ещё 4' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Механико-технологический', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-42 01 01-01, 1-36 01 06 · ещё 6' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Маркетинга, менеджмента, предпринимательства', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-25 01 07, 6-05-0311-02' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Энергетический', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-43 01 05, 1-43 01 03 · ещё 4' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Информационных технологий и робототехники', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-40 01 01, 1-40 05 01, 1-53 01 05 · ещё 5' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Энергетического строительства', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '7-07-0732-02' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Строительный', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-70 02 01, 1-07-0732-01' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Приборостроительный', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-38 02 01, 1-54 01 01-01 · ещё 4' },
  { id: 1, name: 'ОАО «МТЗ»', unp: '100307586', contact: 'Анна Ковалёва', contracts: 4, status: 'ACTIVE', faculty: 'Транспортных коммуникаций', contractNumber: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020', endDate: '31.12.2030', specialties: '1-36 11 01-01' },
]

const facultyNames = ['Автотракторный', 'Архитектурный', 'Военно-технический', 'Горного дела и инженерной экологии', 'Инженерно-педагогический', 'Информационных технологий и робототехники', 'Маркетинга, менеджмента, предпринимательства', 'Машиностроительный', 'Международного сотрудничества', 'Механико-технологический', 'Приборостроительный', 'Спортивно-технический', 'Строительный', 'Технологий управления и гуманитаризации', 'Транспортных коммуникаций', 'Энергетический', 'Энергетического строительства']

export function OrganizationsPage() {
  const [query, setQuery] = useState('')
  const [facultyQuery, setFacultyQuery] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('Все факультеты')
  const [year, setYear] = useState('Любой год окончания')
  const filteredRows = useMemo(() => rows.filter(row => (!query || `${row.name} ${row.contractNumber}`.toLowerCase().includes(query.toLowerCase())) && (selectedFaculty === 'Все факультеты' || row.faculty === selectedFaculty) && (!facultyQuery || row.faculty.toLowerCase().includes(facultyQuery.toLowerCase()))), [query, facultyQuery, selectedFaculty])
  const resetFilters = () => { setQuery(''); setFacultyQuery(''); setSelectedFaculty('Все факультеты'); setYear('Любой год окончания') }
  const goToStatistics = () => document.getElementById('organization-stats')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return <>
    <PageHeader eyebrow="РЕЕСТР" title="Организации" description="Компании-заказчики кадров и связанные с ними договоры" action={<div className="organizations-actions"><button className="secondary" type="button" onClick={goToStatistics}>К статистике</button><button className="primary"><Plus size={17} /> Добавить организацию</button></div>} />
    <section className="organization-registry">
      <aside className="faculty-tree"><div className="faculty-title">ДЕРЕВО ФАКУЛЬТЕТОВ</div><div className="faculty-search"><Search size={14} /><input value={facultyQuery} onChange={event => setFacultyQuery(event.target.value)} placeholder="Поиск в дереве" /></div><button className={`faculty-root ${selectedFaculty === 'Все факультеты' ? 'selected' : ''}`} onClick={() => setSelectedFaculty('Все факультеты')}><ChevronDown size={13} /> <span>Все факультеты</span><b>{rows.length}</b></button>{facultyNames.filter(name => !facultyQuery || name.toLowerCase().includes(facultyQuery.toLowerCase())).map(name => <button className={`faculty-item ${selectedFaculty === name ? 'selected' : ''}`} key={name} onClick={() => setSelectedFaculty(name)}><ChevronRight size={12} /><Folder size={13} /><span>{name}</span><b>{rows.filter(row => row.faculty === name).length}</b></button>)}</aside>
      <div className="registry-main"><div className="registry-toolbar"><div className="registry-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Организация, номер или код специальности" /></div><select value={selectedFaculty} onChange={event => setSelectedFaculty(event.target.value)}><option>Все факультеты</option>{facultyNames.map(name => <option key={name}>{name}</option>)}</select><select value={year} onChange={event => setYear(event.target.value)}><option>Любой год окончания</option><option>2030</option><option>2029</option><option>2028</option></select><button className="filter-button" type="button" onClick={resetFilters}>Сбросить фильтры</button></div><div className="registry-table-wrap"><table className="registry-table"><thead><tr><th>Организация</th><th>Факультет</th><th>Номер договора / действующая редакция</th><th>Статус</th><th>Дата окончания</th><th>Специальности факультета</th></tr></thead><tbody>{filteredRows.map((row, index) => <tr className={index === 6 ? 'active-row' : ''} key={`${row.faculty}-${index}`}><td><Link to={`/organizations/${row.id}`} className="registry-org">{row.name}<ArrowUpRight size={12} /></Link></td><td>{row.faculty}</td><td>{row.contractNumber}</td><td><span className="registry-status">Активен</span></td><td><span className="registry-date">{row.endDate}</span></td><td>{row.specialties}</td></tr>)}</tbody></table></div></div>
    </section>
    <div id="organization-stats" className="stats" style={{ marginTop: 28 }}><div><span>Всего организаций</span><strong>24</strong><small className="positive">+3 за месяц</small></div><div><span>Активные договоры</span><strong>38</strong><small>из 51 договора</small></div><div><span>Требуют внимания</span><strong className="accent-text">6</strong><small>документов на проверке</small></div></div>
  </>
}
