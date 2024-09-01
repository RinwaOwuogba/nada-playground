import React, { useState, useCallback, KeyboardEvent } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import yaml from "js-yaml";
import { INadaInput } from "../../hooks/useNadaInput";
import { generateId } from "@/hooks/useNadaInput/useManualNadaInput";

const GitHubImporter: React.FC<IGitHubImporterProps> = ({
  isOpen,
  onClose,
  loadProgram,
}) => {
  const [programUrl, setProgramUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const toast = useToast();

  const handleImport = useCallback(async () => {
    setIsImporting(true);
    try {
      const [programContent, inputContent] = await Promise.all([
        fetchGithubCode(programUrl),
        fetchGithubCode(inputUrl),
      ]);
      const parsedInputs = parseInputYaml(inputContent);
      loadProgram(programContent, parsedInputs);
      toast({
        title: "Import successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
      setProgramUrl(""); // Clear input after successful import
      setInputUrl(""); // Clear input after successful import
      onClose();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred while importing the files.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsImporting(false);
    }
  }, [programUrl, inputUrl, loadProgram, onClose, setIsImporting, toast]);

  const handleClose = useCallback(() => {
    if (!isImporting) {
      onClose();
    } else {
      toast({
        title: "Please wait",
        description: "Please wait for the import to conclude",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isImporting, onClose, toast]);

  const isLoadButtonDisabled = !programUrl || !inputUrl || isImporting;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !isImporting) {
        handleImport();
      }
    },
    [handleImport, isImporting]
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader data-testid={isOpen}>
          Import program from github
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>GitHub Program URL</FormLabel>
            <Input
              placeholder="https://github.com/NillionNetwork/nada-by-example/blob/main/src/addition.py"
              value={programUrl}
              onChange={(e) => setProgramUrl(e.target.value)}
              isDisabled={isImporting}
              onKeyDown={handleKeyPress}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>GitHub Input URL</FormLabel>
            <Input
              placeholder="https://github.com/NillionNetwork/nada-by-example/blob/main/src/addition_input.yaml"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              isDisabled={isImporting}
              onKeyDown={handleKeyPress}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleImport}
            isLoading={isImporting}
            isDisabled={isLoadButtonDisabled}
          >
            Load Program
          </Button>
          <Button
            variant="ghost"
            onClick={handleClose}
            isDisabled={isImporting}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface IGitHubImporterProps {
  isOpen: boolean;
  isDisabled?: boolean;
  onClose: () => void;
  loadProgram: (program: string, inputs: INadaInput[]) => void;
}

const fetchGithubCode = async (url: string): Promise<string> => {
  const [, , owner, repo, , ...pathParts] = url.split("/").filter(Boolean);
  const path = pathParts.slice(1).join("/");
  const branch = pathParts[0];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

  const response = await axios.get(apiUrl, {
    headers: {
      Accept: "application/vnd.github.v3.raw",
    },
  });

  return response.data;
};

const parseInputYaml = (yamlContent: string): INadaInput[] => {
  const parsed = yaml.load(yamlContent) as { inputs: Record<string, string> };
  return Object.entries(parsed.inputs).map(([name, value]) => ({
    id: generateId(),
    name,
    type: "",
    value: value.toString(),
  }));
};

export default GitHubImporter;
