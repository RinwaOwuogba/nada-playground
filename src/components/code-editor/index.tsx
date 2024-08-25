import nadaHighlightExtension from "@/lib/nada-highlight-extension";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { useMemo } from "react";
// import { useMemo } from "react";
// import nadaPython from "@/lib/nada-python";
// import customExtension from "@/lib/nada-python";
import { python } from "@codemirror/lang-python";

const CodeEditor = ({
  code,
  setCode,
  placeholder,
  extensions = [nadaHighlightExtension()],
}: ICodeEditorProps) => {
  const handleChange = (val: string) => setCode(val);

  const completeExtensions = useMemo(
    () => [python(), ...extensions],
    [extensions]
  );

  return (
    <CodeMirror
      value={code}
      height="300px"
      onChange={handleChange}
      placeholder={placeholder}
      extensions={completeExtensions}
    />
  );
};

interface ICodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  placeholder: string;
  extensions?: Extension[];
}

export default CodeEditor;
