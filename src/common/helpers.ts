export const isDefined = <T>(input?: T | null): input is T => {
  return (typeof input !== 'undefined' && input != null);
}
