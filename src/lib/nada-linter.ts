import { syntaxTree } from "@codemirror/language";
import { Diagnostic, linter } from "@codemirror/lint";

const secretConstructors = new Set([
  "SecretInteger",
  "SecretUnsignedInteger",
  "SecretBoolean",
]);
const publicConstructors = new Set([
  "PublicInteger",
  "PublicUnsignedInteger",
  "PublicBoolean",
]);
const literalConstructors = new Set(["Integer", "UnsignedInteger", "Boolean"]);
const inputFunction = new Set(["Input"]);
const nonLiteralConstructors = new Set([
  ...secretConstructors,
  ...publicConstructors,
]);
const allConstructors = new Set([
  ...secretConstructors,
  ...publicConstructors,
  ...literalConstructors,
]);

export const getCallExpressionName = (nodeText: string) => {
  return nodeText.split("(")[0].trim();
};

const nadaLinter = linter((view) => {
  const diagnostics: Diagnostic[] = [];
  const nadaInputVars = new Set<string>();

  syntaxTree(view.state)
    .cursor()
    .iterate((node) => {
      const nodeName = node.name;
      const nodeText = view.state.sliceDoc(node.from, node.to);

      // console.log("node.name", nodeName);
      // console.log("node.text", nodeText);

      if (nodeName == "AssignStatement") {
        const assignmentParts = nodeText.split("=").map((part) => part.trim());
        const leftSide = assignmentParts[0];
        const rightSide = assignmentParts[1];

        if (rightSide.startsWith("Input(")) {
          nadaInputVars.add(leftSide);
        }
      }

      if (nodeName == "CallExpression") {
        const callExpressionName = getCallExpressionName(nodeText);

        if (callExpressionName == "Input") {
          const rules = [
            {
              regex: /Input\([^=,]+=[^,]+,\s*[^"'=\s]+[^=,)]*\)/,
              message:
                "Positional arguments cannot come before keyword arguments in Input function.",
            },
            {
              regex: /Input(\([^,)]+\)|\([^,)]+,\s*\))/,
              message:
                "Input function must have both name and party arguments.",
            },
          ];

          for (const rule of rules) {
            const match = nodeText.match(rule.regex);
            if (match) {
              const from = node.from + (match.index ?? 0);
              const to = from + match[0].length;
              diagnostics.push({
                from,
                to,
                severity: "error",
                message: rule.message,
              });
              return false;
            }
          }
        }

        if (nonLiteralConstructors.has(callExpressionName)) {
          const argList = node.node.getChild("ArgList");
          if (argList) {
            const argListText = view.state.sliceDoc(argList.from, argList.to);
            const argument = argListText
              .slice(1, argListText.length - 1)
              .trim(); // remove parentheses

            if (
              !argument.startsWith("Input(") &&
              !nadaInputVars.has(argument)
            ) {
              diagnostics.push({
                from: argList.from,
                to: argList.to,
                severity: "error",
                message:
                  "Non-literal constructor must have a valid Input argument.",
              });

              return false;
            }
          } else {
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: "error",
              message:
                "Non-literal constructor must have a valid Input argument.",
            });

            return false;
          }
        }
      }

      // TODO: Add more rules

      // TODO: make python syntax error descriptionmore robust
      if (node.type.isError) {
        diagnostics.push({
          from: node.from,
          to: node.to,
          severity: "error",
          message: "Python syntax error.",
        });

        return false;
      }

      return true;
    });

  return diagnostics;
});

export default nadaLinter;
