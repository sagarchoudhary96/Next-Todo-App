import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

const IS_SERVER = typeof window === "undefined";
const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  // this method read our localStorage value and return it
  const readValue = useCallback((): T => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    // Prevent build error "window is undefined" but keep working
    if (IS_SERVER) {
      return initialValueToUse;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValueToUse;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValueToUse;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState(readValue());

  // this method update our localStorage and our state
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(readValue()) : value;

      // Prevent build error "window is undefined" but keep working
      if (IS_SERVER) {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
      }
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, readValue]
  );

  const removeValue = useCallback(() => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried removing localStorage key “${key}” even though environment is not a client`
      );
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    // Remove the key from local storage
    window.localStorage.removeItem(key);
    // Save state with default value
    setStoredValue(defaultValue);
  }, [initialValue, key]);

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Listen to changes of key in localStorage
  // This could be useful if the value is changed in another tab or window
  useEffect(() => {
    if (IS_SERVER) {
      return;
    }
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(readValue());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
