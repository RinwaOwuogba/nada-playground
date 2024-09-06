import nadaHighlightExtension from "@/lib/nada-highlight-extension";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";
import { useMemo } from "react";
import { python } from "@codemirror/lang-python";
import { githubLight } from "@uiw/codemirror-theme-github";
import { lintGutter } from "@codemirror/lint";
import nadaLinter from "@/lib/nada-linter";

const CodeEditor = ({
  code,
  setCode,
  placeholder,
  extensions = [nadaHighlightExtension()],
}: ICodeEditorProps) => {
  const handleChange = (val: string) => setCode(val);

  const completeExtensions = useMemo(
    () => [
      ...extensions,
      python(),
      nadaLinter,
      lintGutter(),
      EditorView.lineWrapping,
    ],
    [extensions]
  );

  return (
    <CodeMirror
      value={code}
      height="300px"
      onChange={handleChange}
      placeholder={placeholder}
      extensions={completeExtensions}
      // theme={githubLight}
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
