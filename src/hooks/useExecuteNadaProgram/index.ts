import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";
import executeNadaCode from "@/lib/nada-executor";
import { IExecutionResult } from "@/components/execution-output";

const useExecuteNadaProgram = ({
  setIsProgramExecuting,
  setExecutionResult,
}: IUseExecuteNadaProgramProps) => {
  const toast = useToast();

  const executeProgram = useCallback(
    async (inputs: INadaInput[], code: string) => {
      console.log("inputs", inputs);
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
        });
      } finally {
        setIsProgramExecuting(false);
      }
    },
    [setIsProgramExecuting, setExecutionResult, toast]
  );

  return { executeProgram };
};

interface IUseExecuteNadaProgramProps {
  setIsProgramExecuting: (isExecuting: boolean) => void;
  setExecutionResult: (result: IExecutionResult[]) => void;
}

export default useExecuteNadaProgram;
