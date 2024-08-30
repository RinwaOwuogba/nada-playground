import { Box } from "@chakra-ui/react";

const ExecutionOutput = ({
  isProgramExecuting,
  executionResult,
  loadingMessage,
  defaultMessage,
}: IExecutionOutputProps) => {
  if (isProgramExecuting) {
    return <Box>{loadingMessage}</Box>;
  }

  if (executionResult.length === 0) {
    return <Box>{defaultMessage}</Box>;
  }

  return (
    <Box>
      {executionResult.map((result, index) => (
        <div key={index}>
          {result.name}: {result.value}
        </div>
      ))}
    </Box>
  );
};

export interface IExecutionResult {
  name: string;
  value: string;
}

interface IExecutionOutputProps {
  isProgramExecuting: boolean;
  executionResult: IExecutionResult[];
  loadingMessage: string;
  defaultMessage: string;
}

export default ExecutionOutput;
