export const isDefined = <T>(input?: T | null): input is T => {
  return (typeof input !== 'undefined' && input != null);
}

export const parseIni = (contents: string): Record<string, string> => {
  return contents.split(/\r?\n/)
    .filter(row => row.trim().length > 0)
    .map(row => row.split('='))
    .reduce(
      (accum, values) => ({ ...accum, [values[0]]: values.slice(1).join() }),
      {} as Record<string, string>,
    );
}