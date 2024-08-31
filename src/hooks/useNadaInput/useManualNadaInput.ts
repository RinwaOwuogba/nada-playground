import { useCallback, useState } from "react";
import { INadaInput } from "./utils";

export function useManualNadaInput() {
  const [inputs, setInputs] = useState<INadaInput[]>([generateDefaultInput()]);

  const setInputProperty = useCallback(
    (key: string, id: string, value: string) => {
      setInputs((prevInputs) =>
        prevInputs.map((input) =>
          input.id === id ? { ...input, [key]: value } : input
        )
      );
    },
    []
  );

  const addInput = useCallback(() => {
    setInputs((prevInputs) => {
      return [...prevInputs, generateDefaultInput()];
    });
  }, [setInputs]);

  return { inputs, setInputProperty, addInput };
}

const generateDefaultInput = (): INadaInput => {
  return {
    id: Math.random().toString(36).substring(2, 10),
    name: "",
    type: "",
    value: "",
  };
};
