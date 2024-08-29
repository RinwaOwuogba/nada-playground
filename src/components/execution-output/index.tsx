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
        <div key={index}>{result.value}</div>
      ))}
    </Box>
  );
};

interface IExecutionResult {
  type: string;
  value: string;
}

interface IExecutionOutputProps {
  isProgramExecuting: boolean;
  executionResult: IExecutionResult[];
  loadingMessage: string;
  defaultMessage: string;
}

export default ExecutionOutput;
