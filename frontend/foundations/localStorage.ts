export const getLocalStorageNumber = (key: string): number | null => {
  const value = typeof window === "undefined"
    ? null
    : window.localStorage.getItem(key);
  const num = Number(value);

  return !value || Number.isNaN(num) ? null : num;
};

export const setLocalStorageNumber = (key: string, value: number) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value.toString());
  }
};
