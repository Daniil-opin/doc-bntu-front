import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  type ApplicationFilters,
  type ApplicationRegistryItem,
  listApplicationRegistry,
} from '../entities/application'
import {
  DEFAULT_APPLICATION_FILTERS,
  filterApplications,
} from '../features/application-filter/model/applicationFilters'
import { ApplicationFilters as ApplicationFiltersForm } from '../features/application-filter/ui/ApplicationFilters'
import { PageHeader } from '../shared/ui/PageHeader'
import { ApplicationsTable } from '../widgets/applications-registry/ApplicationsTable'

function filtersFromSearchParams(searchParams: URLSearchParams): ApplicationFilters {
  const status = searchParams.get('status')
  return {
    query: searchParams.get('query') ?? DEFAULT_APPLICATION_FILTERS.query,
    faculty: searchParams.get('faculty') ?? DEFAULT_APPLICATION_FILTERS.faculty,
    status:
      status === 'DRAFT' || status === 'REVIEW' || status === 'SIGNED' || status === 'ARCHIVED'
        ? status
        : DEFAULT_APPLICATION_FILTERS.status,
  }
}

function toSearchParams(filters: ApplicationFilters) {
  const searchParams = new URLSearchParams()
  if (filters.query) searchParams.set('query', filters.query)
  if (filters.faculty !== 'all') searchParams.set('faculty', filters.faculty)
  if (filters.status !== 'all') searchParams.set('status', filters.status)
  return searchParams
}

function areFiltersEqual(first: ApplicationFilters, second: ApplicationFilters) {
  return (
    first.query === second.query &&
    first.faculty === second.faculty &&
    first.status === second.status
  )
}

export function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialFilters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams])
  const [draftFilters, setDraftFilters] = useState(initialFilters)
  const [filters, setFilters] = useState(initialFilters)
  const [applications, setApplications] = useState<ApplicationRegistryItem[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    void listApplicationRegistry()
      .then((items) => {
        if (isCurrent) setApplications(items)
      })
      .catch(() => {
        if (isCurrent) setError('Не удалось загрузить реестр заявок. Попробуйте обновить страницу.')
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const faculties = useMemo(
    () => [...new Set(applications.flatMap((application) => application.faculties))].sort(),
    [applications],
  )
  const visibleApplications = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters],
  )
  const applyFilters = (event: FormEvent) => {
    event.preventDefault()
    const nextFilters = { ...draftFilters, query: draftFilters.query.trim() }
    setDraftFilters(nextFilters)
    setFilters(nextFilters)
    setSearchParams(toSearchParams(nextFilters))
  }
  const resetFilters = () => {
    setDraftFilters(DEFAULT_APPLICATION_FILTERS)
    setFilters(DEFAULT_APPLICATION_FILTERS)
    setSearchParams({})
  }

  return (
    <>
      <PageHeader
        eyebrow="ОБРАЩЕНИЯ"
        title="Заявки"
        description="Все полученные заявки организаций-заказчиков"
      />
      <ApplicationFiltersForm
        value={draftFilters}
        faculties={faculties}
        onChange={setDraftFilters}
        onSubmit={applyFilters}
        onReset={resetFilters}
        showReset={!areFiltersEqual(draftFilters, DEFAULT_APPLICATION_FILTERS)}
      />
      {isLoading ? (
        <div className="table-wrap" role="status" aria-live="polite">
          <div className="empty">Загрузка заявок…</div>
        </div>
      ) : error ? (
        <div className="page-notification is-error" role="alert">
          {error}
        </div>
      ) : (
        <section aria-label="Реестр заявок">
          <p className="audit-count" aria-live="polite">
            Найдено заявок: <strong>{visibleApplications.length}</strong>
          </p>
          <ApplicationsTable applications={visibleApplications} />
        </section>
      )}
    </>
  )
}
