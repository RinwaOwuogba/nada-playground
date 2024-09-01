import nadaHighlightExtension from "@/lib/nada-highlight-extension";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";
import { useMemo } from "react";
import { python } from "@codemirror/lang-python";
import { Button, Flex, Text } from "@chakra-ui/react";

const CodeEditor = ({
  label,
  code,
  setCode,
  placeholder,
  extensions = [nadaHighlightExtension()],
}: ICodeEditorProps) => {
  const handleChange = (val: string) => setCode(val);

  const completeExtensions = useMemo(
    () => [python(), ...extensions, EditorView.lineWrapping],
    [extensions]
  );

  return (
    <Flex direction="column">
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="bold" color="gray.400">
          {label}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="blue"
          alignSelf="flex-end"
          onClick={() => setCode("")}
        >
          Reset
        </Button>
      </Flex>
      <CodeMirror
        value={code}
        height="300px"
        onChange={handleChange}
        placeholder={placeholder}
        extensions={completeExtensions}
      />
    </Flex>
  );
};

interface ICodeEditorProps {
  label: string;
  code: string;
  setCode: (code: string) => void;
  placeholder: string;
  extensions?: Extension[];
}

export default CodeEditor;
