import { ArrowLeft, Check, Download } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { PageHeader } from '../shared/ui/PageHeader'
import { StatusBadge } from '../shared/ui/StatusBadge'
export function ApplicationPage() {
  const { id } = useParams()
  return (
    <>
      <Link className="back-link" to="/applications">
        <ArrowLeft size={16} /> Все заявки
      </Link>
      <PageHeader
        eyebrow={`ЗАЯВКА · #${id}`}
        title="Заявка З-2026/086"
        description="ОАО «Беларуськалий» · создана 16 сентября 2026"
        action={
          <button className="secondary">
            <Download size={17} /> Скачать DOCX
          </button>
        }
      />
      <div className="application-layout">
        <div className="panel">
          <div className="panel-title">
            <h2>Детали заявки</h2>
            <StatusBadge status="REVIEW" />
          </div>
          <dl className="data-list">
            <div>
              <dt>Организация</dt>
              <dd>ОАО «Беларуськалий»</dd>
            </div>
            <div>
              <dt>Факультет</dt>
              <dd>ФИТР</dd>
            </div>
            <div>
              <dt>Специальность</dt>
              <dd>Программная инженерия</dd>
            </div>
            <div>
              <dt>Количество мест</dt>
              <dd>12</dd>
            </div>
            <div>
              <dt>Планируемый год выпуска</dt>
              <dd>2027</dd>
            </div>
          </dl>
          <button className="primary">
            <Check size={17} /> Подтвердить заявку
          </button>
        </div>
        <div className="panel timeline">
          <h2>История изменений</h2>
          {['Заявка создана', 'Документы загружены', 'Отправлена на проверку'].map(
            (item, index) => (
              <div className="timeline-item" key={item}>
                <span className={index === 2 ? 'dot current' : 'dot'} />{' '}
                <div>
                  <b>{item}</b>
                  <small>{16 + index} сентября 2026 · Алексей Иванов</small>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </>
  )
}
