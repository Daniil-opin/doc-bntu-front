import { Download, FileSpreadsheet, Upload } from 'lucide-react'
import { ChangeEvent, useRef, useState } from 'react'

import { dataTransferApi } from '../features/data-transfer/api/dataTransferApi'
import { PageHeader } from '../shared/ui/PageHeader'
import styles from './DataTransferPage.module.css'

export function DataTransferPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [busy, setBusy] = useState<'import' | 'export' | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setMessage('')
    setError('')
  }

  const upload = async () => {
    if (!selectedFile) return
    setBusy('import')
    setMessage('')
    setError('')
    try {
      await dataTransferApi.importExcel(selectedFile)
      setMessage(`Файл «${selectedFile.name}» успешно загружен.`)
      setSelectedFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch {
      setError('Не удалось импортировать файл. Проверьте формат .xlsx и доступ к серверу.')
    } finally {
      setBusy(null)
    }
  }

  const download = async () => {
    setBusy('export')
    setMessage('')
    setError('')
    try {
      const blob = await dataTransferApi.exportExcel()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'registry-export.xlsx'
      link.click()
      URL.revokeObjectURL(url)
      setMessage('Экспорт реестра завершён.')
    } catch {
      setError('Не удалось экспортировать данные. Проверьте доступ к серверу.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="РАБОЧЕЕ ПРОСТРАНСТВО"
        title="Импорт и экспорт"
        description="Обмен данными реестра с Excel-файлами"
      />
      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={`${styles.icon} ${styles.importIcon}`}>
            <Upload size={22} />
          </div>
          <h2>Импорт данных</h2>
          <p>
            Загрузите Excel-файл, чтобы добавить организации, договоры и кадровую потребность в
            реестр.
          </p>
          <input ref={inputRef} type="file" accept=".xlsx" onChange={chooseFile} hidden />
          <button className="secondary" type="button" onClick={() => inputRef.current?.click()}>
            <FileSpreadsheet size={17} /> Выбрать файл
          </button>
          {selectedFile && (
            <div className={styles.selectedFile}>
              <FileSpreadsheet size={16} />
              <span>
                {selectedFile.name}
                <small>{Math.ceil(selectedFile.size / 1024)} КБ</small>
              </span>
              <button className="primary" type="button" onClick={upload} disabled={busy !== null}>
                {busy === 'import' ? 'Загрузка...' : 'Импортировать'}
              </button>
            </div>
          )}
        </section>
        <section className={styles.card}>
          <div className={`${styles.icon} ${styles.exportIcon}`}>
            <Download size={22} />
          </div>
          <h2>Экспорт данных</h2>
          <p>
            Скачайте полный реестр в формате Excel для анализа, резервного копирования или обмена.
          </p>
          <button className="primary" type="button" onClick={download} disabled={busy !== null}>
            <Download size={17} />
            {busy === 'export' ? 'Формирование...' : 'Скачать Excel'}
          </button>
          <small className={styles.note}>
            Экспортируются организации, договоры, факультеты и кадровая потребность.
          </small>
        </section>
      </div>
      {message && <div className={`${styles.message} ${styles.successMessage}`}>{message}</div>}
      {error && <div className={`${styles.message} ${styles.errorMessage}`}>{error}</div>}
    </>
  )
}
