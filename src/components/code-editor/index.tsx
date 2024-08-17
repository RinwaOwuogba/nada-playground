import constants from "@/constants";

const CodeEditor = ({}: ICodeEditorProps) => {
  return (
    <div>
      <input placeholder={constants.EDITOR_PLACEHOLDER_TEXT} />
    </div>
  );
};

interface ICodeEditorProps {
  code: string;
  setCode: (code: string) => void;
}
export default CodeEditor;
