import { useCallback, useEffect, useState } from "react";
import { INadaInput } from "./utils";

export function useManualNadaInput(initialInputs?: INadaInput[]) {
  const [inputs, setInputs] = useState<INadaInput[]>([generateDefaultInput()]);

  useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs);
    }
  }, [initialInputs]);

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

  const removeInput = useCallback(
    (id: string) => {
      setInputs((prevInputs) => prevInputs.filter((input) => input.id !== id));
    },
    [setInputs]
  );

  return { inputs, setInputProperty, addInput, removeInput };
}

const generateDefaultInput = (): INadaInput => {
  return {
    id: Math.random().toString(36).substring(2, 10),
    name: "",
    type: "SecretInteger",
    value: "",
  };
};
