import { ArrowLeft, ArrowRight, FileText, Mail } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../app/providers'
import { authApi } from '../features/auth/api/authApi'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (signIn(username, password)) navigate('/')
    else setError('Введите логин и пароль')
  }

  const resetPassword = async (event: FormEvent) => {
    event.preventDefault()
    if (!username.trim()) {
      setError('Введите логин')
      return
    }
    setError('')
    setResetLoading(true)
    try {
      await authApi.requestPasswordReset(username.trim())
      setResetSent(true)
    } catch {
      setError('Сервис восстановления пока не подключён. Обратитесь к администратору.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="logo light">
          <span className="logo-mark">
            <FileText size={18} />
          </span>
          <span>
            КАДРОВЫЙ
            <br />
            <b>ЗАКАЗ</b>
          </span>
        </div>
        <div className="art-copy">
          <div className="eyebrow">ЦИФРОВАЯ СИСТЕМА БНТУ</div>
          <h1>
            Кадровый заказ
            <br />
            <em>под контролем.</em>
          </h1>
          <p>Единое пространство для договоров, заявок и документов организаций-заказчиков.</p>
        </div>
        <div className="art-footer">Белорусский национальный технический университет</div>
      </div>
      {mode === 'login' ? (
        <LoginForm
          username={username}
          password={password}
          error={error}
          setUsername={setUsername}
          setPassword={setPassword}
          submit={submit}
          openReset={() => {
            setMode('reset')
            setError('')
          }}
        />
      ) : (
        <ResetForm
          username={username}
          error={error}
          resetSent={resetSent}
          loading={resetLoading}
          setUsername={setUsername}
          submit={resetPassword}
          back={() => {
            setMode('login')
            setResetSent(false)
            setError('')
          }}
        />
      )}
    </div>
  )
}

function LoginForm({
  username,
  password,
  error,
  setUsername,
  setPassword,
  submit,
  openReset,
}: {
  username: string
  password: string
  error: string
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  submit: (event: FormEvent) => void
  openReset: () => void
}) {
  return (
    <form className={`login-form ${styles.loginForm}`} onSubmit={submit}>
      <div className={styles.formHeading}>
        <div className="eyebrow">ДОБРО ПОЖАЛОВАТЬ</div>
        <h2>Войти в систему</h2>
        <p>Используйте учётную запись сотрудника БНТУ</p>
      </div>
      <label>
        Логин
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
      </label>
      <label>
        Пароль
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button className="primary full" type="submit">
        Продолжить <ArrowRight size={17} />
      </button>
      <button className={styles.textButton} type="button" onClick={openReset}>
        Забыли пароль?
      </button>
      <small className="login-help">Доступ предоставляется администратором системы</small>
    </form>
  )
}

function ResetForm({
  username,
  error,
  resetSent,
  loading,
  setUsername,
  submit,
  back,
}: {
  username: string
  error: string
  resetSent: boolean
  loading: boolean
  setUsername: (value: string) => void
  submit: (event: FormEvent) => void
  back: () => void
}) {
  if (resetSent)
    return (
      <div className={`login-form ${styles.successBox}`}>
        <Mail size={24} />
        <h2>Проверьте почту</h2>
        <p>Если логин существует, на связанную с ним почту отправлен новый пароль.</p>
        <button className="secondary full" type="button" onClick={back}>
          Вернуться ко входу
        </button>
      </div>
    )
  return (
    <form className={`login-form ${styles.loginForm}`} onSubmit={submit}>
      <div className={styles.formHeading}>
        <button className={`back-link ${styles.loginBack}`} type="button" onClick={back}>
          <ArrowLeft size={16} /> Назад ко входу
        </button>
        <div className="eyebrow">ВОССТАНОВЛЕНИЕ ДОСТУПА</div>
        <h2>Забыли пароль?</h2>
        <p>Введите логин, и мы отправим новый пароль на почту, указанную в профиле.</p>
      </div>
      <label>
        Логин
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          autoFocus
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button className="primary full" type="submit" disabled={loading}>
        {loading ? (
          'Отправка...'
        ) : (
          <>
            Отправить новый пароль <Mail size={17} />
          </>
        )}
      </button>
      <small className="login-help">Письмо может прийти в течение нескольких минут</small>
    </form>
  )
}
