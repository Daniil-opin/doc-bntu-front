import type { ApplicationRegistryItem } from '../model/types'

// Временный локальный adapter: backend-контракт реестра заявок в проекте пока отсутствует.
// После согласования API этот модуль заменяется вызовом shared/api/client без изменений UI.
const createDemoScan = (number: string) => ({
  name: `${number}.txt`,
  url: `data:text/plain;charset=utf-8,${encodeURIComponent(`Временный скан заявки ${number}`)}`,
})

const registry: ApplicationRegistryItem[] = [
  {
    id: 1,
    number: 'З-2026/086',
    organization: { id: 1, name: 'ОАО «Беларуськалий»' },
    receivedAt: '2026-09-16',
    signedAt: '2026-09-20',
    faculties: ['Информационных технологий и робототехники', 'Энергетический'],
    status: 'REVIEW',
    scan: createDemoScan('З-2026-086'),
  },
  {
    id: 2,
    number: 'З-2026/084',
    organization: { id: 2, name: 'ЗАО «Атлант»' },
    receivedAt: '2026-09-12',
    signedAt: '2026-09-18',
    faculties: ['Энергетический', 'Механико-технологический'],
    status: 'SIGNED',
  },
  {
    id: 3,
    number: 'З-2026/079',
    organization: { id: 3, name: 'ОАО «Гродно Азот»' },
    receivedAt: '2026-09-05',
    faculties: ['Машиностроительный', 'Горного дела и инженерной экологии'],
    status: 'DRAFT',
    scan: createDemoScan('З-2026-079'),
  },
  {
    id: 4,
    number: 'З-2026/071',
    organization: { id: 4, name: 'ОАО «МТЗ»' },
    receivedAt: '2026-08-28',
    signedAt: '2026-09-03',
    faculties: [
      'Автотракторный',
      'Машиностроительный',
      'Механико-технологический',
      'Маркетинга, менеджмента, предпринимательства',
    ],
    status: 'SIGNED',
    scan: createDemoScan('З-2026-071'),
  },
]

export async function listApplicationRegistry(): Promise<ApplicationRegistryItem[]> {
  return registry
}
