import { syntaxTree } from "@codemirror/language";
import { EditorState, Range, StateEffect, StateField } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Decoration } from "@uiw/react-codemirror";

const highlightEffect = StateEffect.define<Range<Decoration>[]>();

const applyHighlights = (
  view: EditorState,
  marks: Record<string, Decoration>
) => {
  const decorations: Range<Decoration>[] = [];
  const varMap: Record<string, string> = {};

  syntaxTree(view)
    .cursor()
    .iterate((node) => {
      // track constructor type e.g SecretInteger, PublicInteger, Integer, etc.
      if (node.name === "CallExpression") {
        const nodeText = view.sliceDoc(node.from, node.to);

        for (const [groupName, constructors] of Object.entries(patternGroups)) {
          const constructorText = nodeText.split("(")[0].trim();
          if (constructors.has(constructorText)) {
            const mark = marks[groupName];
            if (mark) {
              decorations.push(
                mark.range(node.from, node.from + constructorText.length)
              );
            }
            break;
          }
        }
      }

      // track membership type e.g trunc_pr, reveal, public_equals
      if (node.name === "MemberExpression") {
        const nodeText = view.sliceDoc(node.from, node.to);

        for (const [groupName, constructors] of Object.entries(patternGroups)) {
          // Find the start index of the method name
          const dotIndex = nodeText.indexOf(".");

          // Extract the method name after '.'
          const methodName = nodeText.substring(dotIndex + 1).trim();

          if (constructors.has(methodName)) {
            const mark = marks[groupName];
            if (mark) {
              decorations.push(
                mark.range(
                  node.from + dotIndex + 1,
                  node.from + dotIndex + 1 + methodName.length
                )
              );
            }
            break;
          }
        }
      }

      // track variable type e.g x = SecretInteger() etc;
      if (node.name == "AssignStatement") {
        const nodeText = view.sliceDoc(node.from, node.to);

        const assignmentParts = nodeText.split("=").map((part) => part.trim());
        const leftSide = assignmentParts[0];
        const rightSide = assignmentParts[1];
        const rightSideTrimmed = rightSide.split("(")[0].trim();

        // Remove the variable from nadaVars if it's being reassigneds
        if (varMap[leftSide]) {
          delete varMap[leftSide];
        }

        const constructorsWithTrackedVariables = new Set([
          "secretConstructors",
          "publicConstructors",
          "miscConstructors",
          "partyConstructors",
        ]);
        for (const [groupName, constructors] of Object.entries(patternGroups)) {
          if (!constructorsWithTrackedVariables.has(groupName)) continue;

          if (constructors.has(rightSideTrimmed)) {
            varMap[leftSide] = groupName;
            break;
          }
        }
      }

      // TODO: Add more highlighting rules

      // apply variable type
      if (node.name === "VariableName") {
        const nodeText = view.sliceDoc(node.from, node.to);
        if (varMap[nodeText]) {
          const mark = marks[varMap[nodeText]];
          if (mark) {
            decorations.push(mark.range(node.from, node.to));
          }
        }
      }

      return true;
    });

  return highlightEffect.of(decorations);
};

export const defaultMarks = {
  secretConstructors: Decoration.mark({ class: "cc-nada-secret-constructor" }),
  publicConstructors: Decoration.mark({ class: "cc-nada-public-constructor" }),
  literalConstructors: Decoration.mark({
    class: "cc-nada-literal-constructor",
  }),
  miscConstructors: Decoration.mark({
    class: "cc-nada-misc-constructor",
  }),
  partyConstructors: Decoration.mark({
    class: "cc-nada-party-constructor",
  }),
  specialFunctions: Decoration.mark({ class: "cc-nada-special-function" }),
};

const nadaHighlightExtension = (marks: NadaMarks = defaultMarks) => {
  return StateField.define({
    create(state) {
      const base = Decoration.set([]);
      const newDecorations = applyHighlights(state, marks);

      return base.update({ add: newDecorations.value, sort: true });
    },
    update(value, transaction) {
      if (transaction.docChanged) {
        const newValue = value.map(transaction.changes);
        const newDecorations = applyHighlights(transaction.state, marks);

        return newValue.update({ add: newDecorations.value, sort: true });
      }

      return value;
    },
    provide: (f) => EditorView.decorations.from(f),
  });
};

interface INadaMarks {
  [key: string]: Decoration;
}

type NadaMarks = INadaMarks;

interface IPatternGroups {
  [key: string]: Set<string>;
}

const patternGroups: IPatternGroups = {
  secretConstructors: new Set([
    "SecretInteger",
    "SecretUnsignedInteger",
    "SecretBoolean",
  ]),
  publicConstructors: new Set([
    "PublicInteger",
    "PublicUnsignedInteger",
    "PublicBoolean",
  ]),
  literalConstructors: new Set(["Integer", "UnsignedInteger", "Boolean"]),
  partyConstructors: new Set(["Party"]),
  miscConstructors: new Set(["Input", "Output"]),
  specialFunctions: new Set(["trunc_pr", "if_else", "reveal", "public_equals"]),
};

export default nadaHighlightExtension;
