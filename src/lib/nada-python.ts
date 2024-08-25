import {
  EditorState,
  Range,
  StateEffect,
  StateField,
  Transaction,
} from "@codemirror/state";
import { EditorView, DecorationSet } from "@codemirror/view";
import { Decoration } from "@uiw/react-codemirror";

const highlightPhrase = "CustomType";
const highlightDecoration = Decoration.mark({
  style: "background-color: yellow",
});

highlightDecoration.range();

const applyHighlights = (doc: any): Range<Decoration> => {
  let x: any;

  return x;
  // let decorations = [];
  // const cursor = doc.iterRange(0, doc.length, (from, to, text) => {
  //   let pos = text.indexOf(highlightPhrase);
  //   while (pos !== -1) {
  //     decorations.push(
  //       highlightDecoration.range(
  //         from + pos,
  //         from + pos + highlightPhrase.length
  //       )
  //     );
  //     pos = text.indexOf(highlightPhrase, pos + highlightPhrase.length);
  //   }
  // });
  // return decorations;
};

export const AltHighlightExtension = StateField.define({
  create(state) {
    state.update;

    return Decoration.set(applyHighlights(state.doc));
  },
  update(value, transaction) {
    const newValue = value.map(transaction.changes);
    // console.log("decorations", decorations);
    console.log("transactions", transaction.changes);
    if (transaction.docChanged) {
      return Decoration.set(applyHighlights(transaction.newDoc));
    }
    return newValue;
  },
  provide: (f) => EditorView.decorations.from(f),
});
