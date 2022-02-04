import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import styles from "./Input.module.css";

const DEBOUNCE_DEALY = 650;

const useDebounceInput = (type, placeholder, callback) => {
  const [value, setValue] = useState("");

  const debouncedSet = useCallback(
    debounce((nextValue) => setValue(nextValue), DEBOUNCE_DEALY),
    []
  );

  const input = (
    <input
      type={type}
      placeholder={placeholder}
      className={styles.input}
      onChange={(e) => {
        callback();
        debouncedSet(e.target.value);
      }}
    />
  );

  return [value, input];
};

export default useDebounceInput;
