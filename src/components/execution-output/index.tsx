import { Box } from "@chakra-ui/react";

const ExecutionOutput = ({
  isProgramExecuting,
  executionResult,
  loadingMessage,
  defaultMessage,
}: IExecutionOutputProps) => {
  const renderContent = () => {
    if (isProgramExecuting) {
      return <>{loadingMessage}</>;
    }

    if (executionResult.length === 0) {
      return <>{defaultMessage}</>;
    }

    return (
      <>
        {executionResult.map((result, index) => (
          <div key={index}>
            {result.name}: {result.value}
          </div>
        ))}
      </>
    );
  };

  return (
    <Box
      border={"1px solid"}
      borderColor={"gray.200"}
      color={"gray.500"}
      fontWeight={"600"}
      backgroundColor={"gray.100"}
      h="100%"
      padding={2}
      borderRadius={2}
      className="code"
    >
      {renderContent()}
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
