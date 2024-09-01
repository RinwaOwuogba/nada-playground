import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";

const ExamplePrograms: React.FC<IExampleProgramsProps> = ({
  isOpen,
  onClose,
  examples,
  loadProgram,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Example Programs</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>Click an example to load it into the playground</Text>
          <VStack
            as="ul"
            spacing={2}
            align="stretch"
            maxHeight="400px"
            overflowY="auto"
            role="list"
          >
            {examples.map((example) => (
              <Box
                key={example.name}
                as="li"
                p={3}
                borderWidth={1}
                borderRadius="md"
                cursor="pointer"
                _hover={{
                  boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                  borderColor: "blue.300",
                }}
                onClick={() => {
                  loadProgram(example.code, example.inputs);
                  onClose();
                }}
              >
                {example.name}
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export interface IExampleProgram {
  name: string;
  description: string;
  code: string;
  inputs: INadaInput[];
}

interface IExampleProgramsProps {
  isOpen: boolean;
  onClose: () => void;
  examples: IExampleProgram[];
  loadProgram: (code: string, inputs: INadaInput[]) => void;
}

export default ExamplePrograms;
