import type { ApplicationFilters, ApplicationRegistryItem } from '../../../entities/application'

export const DEFAULT_APPLICATION_FILTERS: ApplicationFilters = {
  query: '',
  faculty: 'all',
  status: 'all',
}

export function filterApplications(
  applications: ApplicationRegistryItem[],
  filters: ApplicationFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase('ru-RU')

  return applications.filter((application) => {
    const matchesQuery =
      !query ||
      `${application.number} ${application.organization.name}`
        .toLocaleLowerCase('ru-RU')
        .includes(query)
    const matchesFaculty =
      filters.faculty === 'all' || application.faculties.includes(filters.faculty)
    const matchesStatus = filters.status === 'all' || application.status === filters.status

    return matchesQuery && matchesFaculty && matchesStatus
  })
}
