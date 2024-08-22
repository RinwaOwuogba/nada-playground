import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { pythonLanguage } from "@codemirror/lang-python";
import { styleTags, tags as t, Tag } from "@lezer/highlight";
import { LanguageSupport, LRLanguage } from "@codemirror/language";

// Define custom highlighting rules that blend with Python's default syntax
const nadaHighlightStyle = HighlightStyle.define([
  // Optional: Specific colors for Nada types and operators
  // { tag: t.className, color: "#2b91af" }, // Matches Python's treatment of type names
  // { tag: t.operator, color: "#a71d5d" }, // Matches Python's treatment of operators
  // { tag: t.function(t.variableName), color: "#d14" }, // Matches Python's function styling
]);

export const secretIntegerTag = Tag.define();

// Extend the existing Python parser to include Nada-specific types and operators
const nadaParser = pythonLanguage.parser.configure({
  props: [
    styleTags({
      // Map Nada-specific types and operations to existing Python syntax tags
      // "SecretInteger PublicInteger Integer SecretUnsignedInteger PublicUnsignedInteger UnsignedInteger SecretBoolean PublicBoolean Boolean Party":
      SecretInteger: t.definitionKeyword,
      // SecretInteger: secretIntegerTag,
      // // '"SecretInteger"': t.className,
      // '"*" "**" "/"': t.operator,
      // "+ - % < > <= >= ==": t.operator,
      // // '"*" "**" "/" "+ - % < > <= >= == "': t.operator,
      // reveal: t.operator, // Functions are treated as such
      // // "trunc_pr if_else reveal public_equals": t.function(t.variableName), // Functions are treated as such
    }),
  ],
});

// Create a language extension for CodeMirror using the extended parser
const nadaPython = () => {
  return new LanguageSupport(LRLanguage.define({ parser: nadaParser }), [
    // syntaxHighlighting(nadaHighlightStyle),
  ]);
};

export default nadaPython;
