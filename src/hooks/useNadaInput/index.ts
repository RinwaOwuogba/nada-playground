import { useState, useCallback, useMemo } from "react";
import { useAutoNadaInput } from "./useAutoNadaInput";
import { useManualNadaInput } from "./useManualNadaInput";

export function useNadaInput(code: string) {
  const [isAutoMode, setIsAutoMode] = useState(true);

  const { inputs: autoInputs, setInputValue: setAutoInputValue } =
    useAutoNadaInput(code);
  const {
    inputs: manualInputs,
    setInputProperty: setManualInputProperty,
    addInput,
  } = useManualNadaInput();

  const inputs = useMemo(
    () => (isAutoMode ? autoInputs : manualInputs),
    [isAutoMode, autoInputs, manualInputs]
  );

  const getInputPropertySetter = useCallback(
    (key: string) => (nameOrId: string, value: string) => {
      if (isAutoMode) {
        setAutoInputValue(nameOrId, value);
      } else {
        setManualInputProperty(key, nameOrId, value);
      }
    },
    [isAutoMode, setAutoInputValue, setManualInputProperty]
  );

  const toggleMode = useCallback(() => {
    setIsAutoMode((prev) => !prev);
  }, []);

  return {
    inputs,
    getInputPropertySetter,
    isAutoMode,
    toggleMode,
    addInput: isAutoMode ? undefined : addInput,
  };
}

export type { INadaInput } from "./utils";
