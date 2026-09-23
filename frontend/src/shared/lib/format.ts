export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU').format(new Date(value))
