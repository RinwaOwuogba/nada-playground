import { Range, StateEffect, StateField, Text } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Decoration } from "@uiw/react-codemirror";

const highlightEffect = StateEffect.define<Range<Decoration>[]>();

const applyHighlights = (
  doc: Text,
  marks: Record<string, Decoration>,
  patterns: Record<string, string>
) => {
  let decorations = [];
  let bufferStart = 0;

  // Iterate through the document to find matches for the specified patterns
  const iterator = doc.iterRange(0, doc.length);
  let iteratorNext;

  while (!iteratorNext || !iteratorNext.done) {
    iteratorNext = iterator.next();
    const line = iteratorNext.value;

    // Track the buffer position for the current line
    const bufferPos = bufferStart;
    bufferStart += line.length;

    // Check if the current line matches any of the specified patterns
    for (const [pattern, identifier] of Object.entries(patterns)) {
      let matchIndex = line.indexOf(pattern);
      while (matchIndex !== -1) {
        // Calculate the absolute `from` and `to` positions in the document
        const from = bufferPos + matchIndex;
        const to = from + pattern.length;

        // Ensure that the pattern is not part of a larger word by checking surrounding characters
        const isStartBoundary =
          matchIndex === 0 || !/\w/.test(line[matchIndex - 1]);
        const isEndBoundary =
          to >= bufferPos + line.length ||
          !/\w/.test(line[matchIndex + pattern.length]);

        if (isStartBoundary && isEndBoundary) {
          // Retrieve the corresponding decorator mark using the identifier
          const mark = marks[identifier];
          if (mark) {
            // Create a highlight decoration range and add it to the list
            decorations.push(mark.range(from, to));
          }
        }

        // Look for the next match within the same line
        matchIndex = line.indexOf(pattern, matchIndex + 1);
      }
    }
  }

  // Return a Decoration set containing all the added decorations
  return highlightEffect.of(decorations);
};

export const defaultMarks = {
  SecretInteger: Decoration.mark({ class: "cc-nada-SecretInteger" }),
  PublicInteger: Decoration.mark({ class: "cc-nada-PublicInteger" }),
  Integer: Decoration.mark({ class: "cc-nada-Integer" }),
  SecretUnsignedInteger: Decoration.mark({
    class: "cc-nada-SecretUnsignedInteger",
  }),
  PublicUnsignedInteger: Decoration.mark({
    class: "cc-nada-PublicUnsignedInteger",
  }),
  UnsignedInteger: Decoration.mark({ class: "cc-nada-UnsignedInteger" }),
  SecretBoolean: Decoration.mark({ class: "cc-nada-SecretBoolean" }),
  PublicBoolean: Decoration.mark({ class: "cc-nada-PublicBoolean" }),
  Boolean: Decoration.mark({ class: "cc-nada-Boolean" }),
  Party: Decoration.mark({ class: "cc-nada-Party" }),
  Output: Decoration.mark({ class: "cc-nada-Output" }),
  function: Decoration.mark({ class: "cc-nada-function" }),
};

export const defaultPatterns = {
  SecretInteger: "SecretInteger",
  PublicInteger: "PublicInteger",
  Integer: "Integer",
  SecretUnsignedInteger: "SecretUnsignedInteger",
  PublicUnsignedInteger: "PublicUnsignedInteger",
  UnsignedInteger: "UnsignedInteger",
  SecretBoolean: "SecretBoolean",
  PublicBoolean: "PublicBoolean",
  Boolean: "Boolean",
  Party: "Party",
  Output: "Output",
  trunc_pr: "function",
  if_else: "function",
  reveal: "function",
  public_equals: "function",
};

const nadaHighlightExtension = (
  marks: NadaMarks = defaultMarks,
  patterns: NadaPatterns = defaultPatterns
) => {
  return StateField.define({
    create(state) {
      const base = Decoration.set([]);
      const newDecorations = applyHighlights(state.doc, marks, patterns);

      return base.update({ add: newDecorations.value, sort: true });
    },
    update(value, transaction) {
      if (transaction.docChanged) {
        let newValue = value.map(transaction.changes);
        const newDecorations = applyHighlights(
          transaction.newDoc,
          marks,
          patterns
        );

        return newValue.update({ add: newDecorations.value, sort: true });
      }

      return value;
    },
    provide: (f) => EditorView.decorations.from(f),
  });
};

type NadaMarks = Record<string, Decoration>;
type NadaPatterns = Record<string, string>;

export default nadaHighlightExtension;
