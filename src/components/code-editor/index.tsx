import nadaHighlightExtension from "@/lib/nada-highlight-extension";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";
import { useMemo } from "react";
// import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";
import {
  nadaPython,
  // python
} from "./python";
// import { python } from "@codemirror/legacy-modes/mode/python";
import { githubLight } from "@uiw/codemirror-theme-github";

const CodeEditor = ({
  code,
  setCode,
  placeholder,
  extensions = [nadaHighlightExtension()],
}: ICodeEditorProps) => {
  const handleChange = (val: string) => setCode(val);

  const completeExtensions = useMemo(
    () => [
      // python
      StreamLanguage.define(nadaPython),
      // StreamLanguage.define(python),
      // ...extensions,
      EditorView.lineWrapping,
    ],
    // () => [python(), ...extensions, EditorView.lineWrapping],
    [extensions, nadaPython]
  );

  return (
    <CodeMirror
      value={code}
      height="300px"
      onChange={handleChange}
      placeholder={placeholder}
      extensions={completeExtensions}
      theme={githubLight}
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
