import nadaHighlightExtension from "@/lib/nada-highlight-extension";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";
import { useMemo } from "react";
// import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";
import { python } from "./python";
// import { python } from "@codemirror/legacy-modes/mode/python";

const CodeEditor = ({
  code,
  setCode,
  placeholder,
  extensions = [nadaHighlightExtension()],
}: ICodeEditorProps) => {
  const handleChange = (val: string) => setCode(val);

  const completeExtensions = useMemo(
    () => [
      StreamLanguage.define(python),
      ...extensions,
      EditorView.lineWrapping,
    ],
    // () => [python(), ...extensions, EditorView.lineWrapping],
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
  label: string;
  code: string;
  setCode: (code: string) => void;
  placeholder: string;
  extensions?: Extension[];
}

export default CodeEditor;
