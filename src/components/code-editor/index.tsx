import CodeMirror, {
  defaultLightThemeOption,
  Extension,
} from "@uiw/react-codemirror";
// import { useMemo } from "react";
import nadaPython from "@/lib/nada-python";
// import { python } from "@codemirror/lang-python";

const CodeEditor = ({
  code,
  setCode,
  placeholder,
  theme: customTheme,
}: ICodeEditorProps) => {
  const handleChange = (val: string) => setCode(val);

  const theme = customTheme ? customTheme : defaultLightThemeOption;

  // const extensions = useMemo(() => [], [python]);

  // const extensions = useMemo(() => [nadaPython()], [nadaPython]);

  return (
    <CodeMirror
      value={code}
      height="300px"
      onChange={handleChange}
      placeholder={placeholder}
      theme={theme}
      extensions={[nadaPython()]}
      // extensions={extensions}
    />
  );
};

interface ICodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  placeholder: string;
  theme?: Extension;
}

export default CodeEditor;
