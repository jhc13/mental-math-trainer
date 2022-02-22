class RecordFormat {
  constructor(calculationMethod, problemCount) {
    this.calculationMethod = calculationMethod;
    this.problemCount = problemCount;
  }
}

const recordFormats = [
  new RecordFormat('MEAN', 1),
  new RecordFormat('MEAN', 3),
  new RecordFormat('AVERAGE', 5),
  new RecordFormat('AVERAGE', 12),
  new RecordFormat('AVERAGE', 50),
  new RecordFormat('AVERAGE', 100),
  new RecordFormat('AVERAGE', 1000)
];

export default recordFormats;
