import { MAX_OPERAND_LENGTH } from 'utils/config';

export function getOperandLengths() {
  return [...Array(MAX_OPERAND_LENGTH).keys()].map((i) => i + 1);
}

export function isEditable(element) {
  return (
    element.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
  );
}
