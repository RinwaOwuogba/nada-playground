// import { CompletionContext, CompletionResult, Completion } from '@codemirror/autocomplete'
import { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";

// Static list of globally available completions
const globalCompletions = [
  "SecretInteger",
  "SecretUnsignedInteger",
  "SecretBoolean",
  "PublicInteger",
  "PublicUnsignedInteger",
  "PublicBoolean",
  "Integer",
  "UnsignedInteger",
  "Boolean",
  "Party",
  "Input",
  "Output",
  // TODO: Handle member function calls
  // "trunc_pr",
  // "if_else",
  // "reveal",
  // "public_equals",
  // Add more global completions as needed
].map((word) => ({ label: word, type: "variable" }));

const dontComplete = ["String", "Comment", "TemplateString"];

interface ISyntaxNode {
  name: string;
  from: number;
  to: number;
  parent: ISyntaxNode | null;
}

export function localCompletionSource(
  context: CompletionContext
): CompletionResult | null {
  const inner = syntaxTree(context.state).resolveInner(
    context.pos,
    -1
  ) as ISyntaxNode;
  if (dontComplete.indexOf(inner.name) > -1) return null;

  const isWord =
    inner.name == "VariableName" ||
    (inner.to - inner.from < 20 &&
      /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/.test(
        context.state.sliceDoc(inner.from, inner.to)
      ));

  if (!isWord && !context.explicit) return null;

  // Filter completions based on the current word
  const currentWord = context.state.sliceDoc(inner.from, context.pos);
  const filteredOptions = globalCompletions.filter((completion) =>
    completion.label.toLowerCase().startsWith(currentWord.toLowerCase())
  );

  return {
    options: filteredOptions,
    from: isWord ? inner.from : context.pos,
    validFor: /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/,
  };
}
