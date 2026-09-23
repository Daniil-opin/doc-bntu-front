import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

import { FacultyMultiSelect } from '../../../components/organization/OrganizationModals'
import styles from './CreateContractForm.module.css'

const createContractSchema = z.object({
  number: z.string().trim().min(1, 'Введите номер договора'),
  date: z.string().min(1, 'Выберите дату'),
  facultyIds: z.array(z.string()).min(1, 'Выберите факультет'),
})

export type CreateContractValues = z.infer<typeof createContractSchema>

export function CreateContractForm({
  faculties,
  onSubmit,
}: {
  faculties: string[]
  onSubmit: (values: CreateContractValues) => void
}) {
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContractValues>({
    resolver: zodResolver(createContractSchema),
    defaultValues: { number: '', date: '', facultyIds: [] },
  })
  const selectedFaculties = useWatch({ control, name: 'facultyIds' })
  const submit = (values: CreateContractValues) => {
    onSubmit(values)
    reset()
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit(submit)}>
      <h3 className={styles.title}>Добавить договор</h3>
      <label className={styles.fieldLabel}>
        Факультеты
        <FacultyMultiSelect
          faculties={faculties}
          value={selectedFaculties}
          onChange={(value) => setValue('facultyIds', value, { shouldValidate: true })}
          className={`${styles.facultyPicker} faculty-picker`}
        />
        {errors.facultyIds && <span className={styles.error}>{errors.facultyIds.message}</span>}
      </label>
      <div className={styles.fields}>
        <input placeholder="Номер договора" {...register('number')} />
        <input type="date" {...register('date')} />
        <button className={`${styles.submit} primary`} type="submit">
          Добавить
        </button>
      </div>
      {(errors.number || errors.date) && (
        <span className={styles.error}>{errors.number?.message ?? errors.date?.message}</span>
      )}
    </form>
  )
}
