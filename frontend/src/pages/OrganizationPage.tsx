import { ArrowLeft, Check, FileUp, Plus, Save, X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  type AgreementForm,
  AgreementModal,
  ContractEditModal,
  type ContractForm,
  StatusModal,
} from '../components/organization/OrganizationModals'
import { CreateContractForm } from '../features/contract-create/ui/CreateContractForm'
import {
  type ApplicationForm,
  RegisterApplicationModal,
} from '../features/register-application/ui/RegisterApplicationModal'
import { useModalAccessibility } from '../shared/hooks/useModalAccessibility'
import { FACULTIES } from '../shared/lib/faculties'
import { PageHeader } from '../shared/ui/PageHeader'
import { Select } from '../shared/ui/Select'
import { OrganizationRequisites } from '../widgets/organization-details/OrganizationRequisites'

type Requisites = {
  shortName: string
  fullName: string
  address: string
  department: string
  phone: string
}
type OrderRow = {
  id: number
  faculty: string
  specialty: string
  qualification: string
  values: Record<number, number>
}
const years = Array.from({ length: 11 }, (_, index) => 2026 + index)
const initialRows: OrderRow[] = [
  {
    id: 1,
    faculty: 'Машиностроительный',
    specialty: '1-36 01 03 02',
    qualification: 'Инженер',
    values: { 2026: 2 },
  },
  {
    id: 2,
    faculty: 'Механико-технологический',
    specialty: '1-42 01 01-01 03',
    qualification: 'Инженер',
    values: { 2026: 3 },
  },
  {
    id: 3,
    faculty: 'Автотракторный',
    specialty: '1-27 01 01-02',
    qualification: 'Инженер-экономист',
    values: {},
  },
  {
    id: 4,
    faculty: 'Маркетинга, менеджмента, предпринимательства',
    specialty: '1-25 01 07',
    qualification: 'Экономист-менеджер',
    values: { 2026: 3 },
  },
  {
    id: 5,
    faculty: 'Автотракторный',
    specialty: '1-37 01 03',
    qualification: 'Инженер-механик',
    values: { 2026: 15, 2027: 16 },
  },
  {
    id: 6,
    faculty: 'Автотракторный',
    specialty: '1-36 01 07',
    qualification: 'Инженер-механик',
    values: { 2026: 1, 2027: 1 },
  },
]
const initialRequisites: Requisites = {
  shortName: 'ОАО «МТЗ»',
  fullName: 'Открытое акционерное общество "Минский тракторный завод"',
  address: 'ул. Долгобродская, 29, 220070, г. Минск',
  department: 'Министерство промышленности',
  phone: '',
}
const initialContract: ContractForm = {
  faculties: ['Автотракторный'],
  number: 'д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020',
  startDate: '2020-10-01',
  endDate: '2030-12-31',
}
const initialAgreement: AgreementForm = { number: '', date: '' }

export function OrganizationPage() {
  const { id } = useParams()
  const [rows, setRows] = useState(initialRows)
  const [requisites, setRequisites] = useState(initialRequisites)
  const [editedRequisites, setEditedRequisites] = useState(initialRequisites)
  const [isRequisitesOpen, setRequisitesOpen] = useState(false)
  const [notification, setNotification] = useState('')
  const [scanName, setScanName] = useState('')
  const [status, setStatusValue] = useState('Активен')
  const [isStatusOpen, setStatusOpen] = useState(false)
  const [nextStatus, setNextStatus] = useState(status)
  const [statusComment, setStatusComment] = useState('')
  const [isApplicationOpen, setApplicationOpen] = useState(false)
  const [application, setApplication] = useState<ApplicationForm>({
    receivedDate: '',
    number: '',
    signedDate: '',
    faculties: [],
  })
  const [contract, setContract] = useState(initialContract)
  const [editedContract, setEditedContract] = useState(initialContract)
  const [isContractEditOpen, setContractEditOpen] = useState(false)
  const [agreement, setAgreement] = useState(initialAgreement)
  const [isAgreementOpen, setAgreementOpen] = useState(false)
  const requisitesDialogRef = useModalAccessibility<HTMLFormElement>(
    () => setRequisitesOpen(false),
    isRequisitesOpen,
  )

  const openRequisites = () => {
    setEditedRequisites(requisites)
    setRequisitesOpen(true)
  }
  const saveRequisites = (event: FormEvent) => {
    event.preventDefault()
    setRequisites(editedRequisites)
    setRequisitesOpen(false)
  }
  const updateRequisite = (field: keyof Requisites, value: string) =>
    setEditedRequisites((current) => ({ ...current, [field]: value }))
  const addRow = () =>
    setRows((current) => [
      ...current,
      {
        id: Date.now(),
        faculty: FACULTIES[0],
        specialty: '',
        qualification: '',
        values: {},
      },
    ])
  const removeRow = (rowId: number) =>
    setRows((current) => current.filter((row) => row.id !== rowId))
  const updateRow = (
    rowId: number,
    field: 'faculty' | 'specialty' | 'qualification',
    value: string,
  ) =>
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    )
  const updateValue = (rowId: number, year: number, value: string) =>
    setRows((current) =>
      current.map((row) =>
        row.id === rowId ? { ...row, values: { ...row.values, [year]: Number(value) || 0 } } : row,
      ),
    )
  const selectScan = (event: ChangeEvent<HTMLInputElement>) =>
    setScanName(event.target.files?.[0]?.name ?? '')
  const saveApplication = (event: FormEvent) => {
    event.preventDefault()
    setApplicationOpen(false)
  }
  const openContractEdit = () => {
    setEditedContract(contract)
    setContractEditOpen(true)
  }
  const saveContract = (event: FormEvent) => {
    event.preventDefault()
    setContract(editedContract)
    setContractEditOpen(false)
  }
  const saveAgreement = (event: FormEvent) => {
    event.preventDefault()
    setAgreementOpen(false)
  }
  const addContract = () => {
    setNotification('Договор добавлен')
    window.setTimeout(() => setNotification(''), 2500)
  }
  const setStatus = (value: string) => {
    setNextStatus(value === 'На проверке' ? 'Закрыт' : value)
    setStatusComment('')
    setStatusOpen(true)
  }
  const saveStatus = (event: FormEvent) => {
    event.preventDefault()
    setStatusValue(nextStatus)
    setStatusOpen(false)
  }

  return (
    <>
      <Link className="back-link" to="/">
        <ArrowLeft size={16} /> К реестру
      </Link>
      <PageHeader
        eyebrow={`ОРГАНИЗАЦИЯ · #${id}`}
        title={requisites.shortName}
        description={requisites.fullName}
        action={
          <>
            <button className="secondary" type="button" onClick={() => setApplicationOpen(true)}>
              <Plus size={14} /> Зарегистрировать заявку
            </button>
            {isApplicationOpen && (
              <RegisterApplicationModal
                application={application}
                organizationName={requisites.shortName}
                onChange={setApplication}
                onClose={() => setApplicationOpen(false)}
                onSave={saveApplication}
              />
            )}
          </>
        }
      />
      <div className="organization-top-grid">
        <OrganizationRequisites requisites={requisites} onEdit={openRequisites} />
        <CreateContractForm faculties={FACULTIES} onSubmit={addContract} />
      </div>
      <section className="contract-panel">
        <div className="contract-heading">
          <div>
            <h2>Договор д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020</h2>
            <p>
              Машиностроительный, Механико-технологический, Автотракторный ·{' '}
              <span className="status-pill">{status}</span> · срок до <b>31.12.2030</b>
            </p>
          </div>
          <div className="contract-actions">
            <button
              className="secondary"
              type="button"
              onClick={() => setStatus(status === 'Активен' ? 'На проверке' : 'Активен')}
            >
              Сменить статус
            </button>
            <button className="primary" type="button">
              <FileUp size={14} /> Сформировать доп. соглашение
            </button>
          </div>
        </div>
        <div className="contract-links">
          <button className="inline-link" type="button" onClick={openContractEdit}>
            ▸ Редактировать договор
          </button>
          <button className="inline-link" type="button" onClick={() => setAgreementOpen(true)}>
            + Зарегистрировать дополнительное соглашение
          </button>
        </div>
        <div className="order-table-wrap">
          <table className="order-table">
            <thead>
              <tr>
                <th>Факультет</th>
                <th>Специальность</th>
                <th>Квалификация</th>
                {years.map((year) => (
                  <th key={year}>{year}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Select
                      className="order-faculty-select"
                      value={row.faculty}
                      onChange={(value) => updateRow(row.id, 'faculty', value)}
                      options={FACULTIES.map((faculty) => ({
                        value: faculty,
                        label: faculty,
                      }))}
                    />
                  </td>
                  <td>
                    <input
                      value={row.specialty}
                      onChange={(event) => updateRow(row.id, 'specialty', event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={row.qualification}
                      onChange={(event) => updateRow(row.id, 'qualification', event.target.value)}
                    />
                  </td>
                  {years.map((year) => (
                    <td key={year}>
                      <input
                        className="year-input"
                        type="number"
                        min="0"
                        value={row.values[year] ?? 0}
                        onChange={(event) => updateValue(row.id, year, event.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <div className="row-actions">
                      <button className="row-confirm" type="button" title="Сохранить строку">
                        <Check size={15} />
                      </button>
                      <button
                        className="row-delete"
                        type="button"
                        title="Удалить строку"
                        onClick={() => removeRow(row.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="inline-link add-row" type="button" onClick={addRow}>
          ▸ + Добавить строку заказа
        </button>
        <div className="scan-footer">
          <b>Сканы подписанных документов:</b>
          <span>{scanName || 'не загружены'}</span>
          <label className="secondary attach-button">
            <FileUp size={14} /> Прикрепить скан
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={selectScan} hidden />
          </label>
        </div>
      </section>
      {isRequisitesOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRequisitesOpen(false)
          }}
        >
          <form
            ref={requisitesDialogRef}
            className="requisites-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="requisites-modal-title"
            tabIndex={-1}
            onSubmit={saveRequisites}
          >
            <div className="modal-header">
              <div>
                <div className="eyebrow">РЕКВИЗИТЫ ОРГАНИЗАЦИИ</div>
                <h2 id="requisites-modal-title">Редактировать реквизиты</h2>
                <p>Обновите данные организации-заказчика.</p>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Закрыть"
                onClick={() => setRequisitesOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="requisites-modal-fields">
              <label>
                Краткое наименование
                <input
                  value={editedRequisites.shortName}
                  onChange={(event) => updateRequisite('shortName', event.target.value)}
                  required
                />
              </label>
              <label>
                Полное наименование
                <input
                  value={editedRequisites.fullName}
                  onChange={(event) => updateRequisite('fullName', event.target.value)}
                  required
                />
              </label>
              <label>
                Адрес
                <input
                  value={editedRequisites.address}
                  onChange={(event) => updateRequisite('address', event.target.value)}
                  required
                />
              </label>
              <label>
                Ведомство
                <input
                  value={editedRequisites.department}
                  onChange={(event) => updateRequisite('department', event.target.value)}
                />
              </label>
              <label>
                Телефон
                <input
                  value={editedRequisites.phone}
                  onChange={(event) => updateRequisite('phone', event.target.value)}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button className="secondary" type="button" onClick={() => setRequisitesOpen(false)}>
                Отмена
              </button>
              <button className="primary" type="submit">
                <Save size={15} /> Сохранить
              </button>
            </div>
          </form>
        </div>
      )}
      {isAgreementOpen && (
        <AgreementModal
          agreement={agreement}
          onChange={setAgreement}
          onClose={() => setAgreementOpen(false)}
          onSave={saveAgreement}
        />
      )}
      {isContractEditOpen && (
        <ContractEditModal
          contract={editedContract}
          faculties={FACULTIES}
          onChange={setEditedContract}
          onClose={() => setContractEditOpen(false)}
          onSave={saveContract}
        />
      )}
      {isStatusOpen && (
        <StatusModal
          currentStatus={status}
          nextStatus={nextStatus}
          comment={statusComment}
          onStatusChange={setNextStatus}
          onCommentChange={setStatusComment}
          onClose={() => setStatusOpen(false)}
          onSave={saveStatus}
        />
      )}
      {notification && (
        <div
          className={`page-notification ${notification === 'Данные не заполнены' ? 'is-error' : ''}`}
          role="status"
        >
          {notification}
        </div>
      )}
    </>
  )
}
