import { useState, useCallback, useMemo } from "react";
import { useAutoNadaInput } from "./useAutoNadaInput";
import { useManualNadaInput } from "./useManualNadaInput";
import { INadaInput } from "./utils";

export function useNadaInput(code: string, initialInputs?: INadaInput[]) {
  const [isAutoMode, setIsAutoMode] = useState(true);

  const { inputs: autoInputs, setInputValue: setAutoInputValue } =
    useAutoNadaInput(code, initialInputs);
  const {
    inputs: manualInputs,
    setInputProperty: setManualInputProperty,
    addInput,
    removeInput,
  } = useManualNadaInput(initialInputs);

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
    removeInput: isAutoMode ? undefined : removeInput,
  };
}

export type { INadaInput };
