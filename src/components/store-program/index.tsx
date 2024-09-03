import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";
import config from "@/config";
// import { getQuote, payAndStoreProgram, createNillionClient } from "./lib";
import { compileProgramBinary } from "@/lib/nada-executor";
import { useStoreProgram } from "@nillion/client-react-hooks";

const StoreProgram: React.FC<IStoreProgramProps> = ({
  isOpen,
  onClose,
  inputs,
  code,
}) => {
  console.log("isopen", isOpen);
  const [programName, setProgramName] = useState<string>("");
  const [programBinary, setProgramBinary] = useState<Uint8Array | null>(null);
  const [quote, setQuote] = useState<any | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [nillionClient, setNillionClient] = useState<any | null>(null);
  const toast = useToast();

  const storeProgram = useStoreProgram();

  // useEffect(() => {
  //   const initializeClient = async () => {
  //     const client = await createNillionClient(config.nillion.userKey);
  //     setNillionClient(client);
  //   };
  //   initializeClient();
  // }, []);

  // const handleGetQuote = async () => {
  //   setLoadingQuote(true);
  //   try {
  //     const programBinary = await compileProgramBinary(inputs, code);
  //     const quote = await getQuote(nillionClient, programBinary);
  //     setProgramBinary(programBinary);
  //     setQuote(quote);
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to get quote",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     setLoadingQuote(false);
  //   }
  // };

  // const handlePayAndStore = async () => {
  //   setLoadingPayment(true);
  //   try {
  //     await payAndStoreProgram(
  //       nillionClient,
  //       programName,
  //       programBinary,
  //       quote
  //     );
  //     toast({
  //       title: "Success",
  //       description: "Program stored successfully",
  //       status: "success",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     onClose();
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to store program",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     setLoadingPayment(false);
  //   }
  // };

  const handleStoreProgram = async () => {
    const programBinary = await compileProgramBinary(inputs, code);

    storeProgram.mutate({
      name: programName,
      program: programBinary,
    });
  };

  const handleClose = () => {
    if (loadingQuote || loadingPayment) {
      toast({
        title: "Warning",
        description: "Please wait till operation completes",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Box p={4} bg="white" borderRadius="md">
          <FormControl>
            <Input
              placeholder="Program Name"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              isDisabled={loadingQuote || loadingPayment}
            />
          </FormControl>
          {/* <Button
            mt={4}
            onClick={handleGetQuote}
            isLoading={loadingQuote}
            isDisabled={loadingQuote || loadingPayment}
          >
            Get Quote
          </Button> */}
          {/* {quote && ( */}
          <Box mt={4}>
            {/* <Text>Quote: {JSON.stringify(quote)}</Text> */}
            <Button
              mt={4}
              onClick={handleStoreProgram}
              // onClick={handlePayAndStore}
              isLoading={loadingPayment}
              isDisabled={loadingPayment}
            >
              Pay and Store
            </Button>
          </Box>
          {/* )} */}
        </Box>
      </Modal>
    </>
  );
};

export default StoreProgram;

interface IStoreProgramProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: INadaInput[];
  code: string;
}
