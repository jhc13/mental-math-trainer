export const OPERATORS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
};

export function pluralize(word, count) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
