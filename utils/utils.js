import { MAX_OPERAND_LENGTH } from './config';

export function getOperandLengths() {
  return [...Array(MAX_OPERAND_LENGTH).keys()].map((i) => i + 1);
}
