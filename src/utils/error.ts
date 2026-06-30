export function getApiErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (typeof data === 'string') return data;
  if (err?.message) return err.message;
  return 'Ocurrió un error inesperado';
}
