import { useCallback, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";
import executeNadaCode from "@/lib/nada-executor";
import { IExecutionResult } from "@/components/execution-output";

const useExecuteNadaProgram = () => {
  const [isProgramExecuting, setIsProgramExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<IExecutionResult[]>(
    []
  );

  const toast = useToast();

  const executeProgram = useCallback(
    async (inputs: INadaInput[], code: string) => {
      setIsProgramExecuting(true);
      try {
        const result = await executeNadaCode(inputs, code);
        setExecutionResult(result);
      } catch (error: unknown) {
        const err = error as Error;
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
          position: "top",
        });
      } finally {
        setIsProgramExecuting(false);
      }
    },
    [setIsProgramExecuting, setExecutionResult, toast]
  );

  return { executeProgram, executionResult, isProgramExecuting };
};

export default useExecuteNadaProgram;
