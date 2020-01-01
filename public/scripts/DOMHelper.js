import {processText} from '/edit/client/js/process.js'
import {oneLiners} from './tags.js'

// returns the index coordinates of the selected text in relation to the parent element
/* assumes that each child node in the parent element has a startIndex property that
indicates where the node start in relation to the parent element */
function computeDOMSelection(selection){
  let start, end;
  if(selection.anchorNode.isSameNode(selection.focusNode)){
    let startIndex = selection.anchorNode.startIndex;
    let offsets = [selection.anchorOffset, selection.focusOffset]
    start = startIndex + Math.min(...offsets);
    end = startIndex + Math.max(...offsets);
  } else {
    // node with lowest startIndex is the leftmost one
    let leftNode = selection.anchorNode.startIndex < selection.focusNode.startIndex ? selection.anchorNode : selection.focusNode;
    let rightNode = selection.anchorNode.startIndex < selection.focusNode.startIndex ? selection.focusNode : selection.anchorNode;
    let leftOffset = leftNode.isSameNode(selection.anchorNode) ? selection.anchorOffset : selection.focusOffset;
    let rightOffset = rightNode.isSameNode(selection.focusNode) ? selection.focusOffset : selection.anchorOffset;
    start = leftNode.startIndex + leftOffset;
    end = rightNode.startIndex + rightOffset;
  }
  return {start, end};
}

function updateInputs(decoratedText, selectedCont, formInput, decoration){
  // fire an enter event to create a new textarea if a one-liner was clicked and was added instead of removed
  if(decoratedText.length > formInput.value.length && Object.keys(oneLiners).indexOf(decoration) !== -1) {
      let enterEvent = new KeyboardEvent("keydown", {key: "Enter"});
      selectedCont.dispatchEvent(enterEvent);
  }
  formInput.value = decoratedText;
  processText(decoratedText).then(processedCont => {
    selectedCont.innerHTML = processedCont;
    selectedCont.dispatchEvent(new KeyboardEvent("keyup"))
  });
}

export {computeDOMSelection, updateInputs};
