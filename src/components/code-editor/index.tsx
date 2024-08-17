import CodeMirror from "@uiw/react-codemirror";

const CodeEditor = ({ code, setCode, placeholder }: ICodeEditorProps) => {
  const handleChange = (val: string) => setCode(val);

  return (
    <CodeMirror
      value={code}
      height="200px"
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

interface ICodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  placeholder: string;
}

export default CodeEditor;
