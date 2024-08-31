import { useState, useCallback, useMemo } from "react";
import { useAutoNadaInput } from "./useAutoNadaInput";
import { useManualNadaInput } from "./useManualNadaInput";
import { INadaInput } from "./utils";

export function useNadaInput({ code, initialInputs }: IUseNadaInputProps) {
  const [isAutoMode, setIsAutoMode] = useState(true);

  const { inputs: autoInputs, setInputValue: setAutoInputValue } =
    useAutoNadaInput(code, initialInputs.auto);
  const {
    inputs: manualInputs,
    setInputProperty: setManualInputProperty,
    addInput,
    removeInput,
  } = useManualNadaInput(initialInputs.manual);

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
    autoInputs,
    manualInputs,
    getInputPropertySetter,
    isAutoMode,
    toggleMode,
    addInput: isAutoMode ? undefined : addInput,
    removeInput: isAutoMode ? undefined : removeInput,
  };
}

export type { INadaInput };

interface IUseNadaInputProps {
  code: string;
  initialInputs: IInitialInputs;
}

export interface IInitialInputs {
  auto?: INadaInput[];
  manual?: INadaInput[];
}
