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

export default function getSetBests(problems) {
  const setProblemCount = problems.length;
  const numberedProblems = problems.map((problem, index) => [index, problem]);
  let setBests = [];
  for (const format of recordFormats) {
    const { calculationMethod, problemCount: recordProblemCount } = format;
    if (recordProblemCount > setProblemCount) {
      continue;
    }
    let minMean = Infinity;
    let minMeanStartIndex = null;
    let minMeanExcludedIndices = null;
    for (let i = 0; i < setProblemCount - recordProblemCount + 1; i++) {
      let excludedIndices = [];
      let mean;
      if (calculationMethod === 'MEAN') {
        const problemSlice = problems.slice(i, i + recordProblemCount);
        const sum = problemSlice.reduce(
          (sum, problem) => sum + problem.centiseconds,
          0
        );
        mean = sum / recordProblemCount;
      }
      if (calculationMethod === 'AVERAGE') {
        const trimCount = Math.ceil(recordProblemCount * 0.05);
        const problemSlice = numberedProblems.slice(i, i + recordProblemCount);
        problemSlice.sort(
          ([_, firstProblem], [__, secondProblem]) =>
            firstProblem.centiseconds - secondProblem.centiseconds
        );
        excludedIndices = problemSlice
          .slice(0, trimCount)
          .map(([index, _]) => index);
        excludedIndices.push(
          ...problemSlice.slice(-trimCount).map(([index, _]) => index)
        );
        const sum = problemSlice
          .slice(trimCount, recordProblemCount - trimCount)
          .reduce((sum, [_, problem]) => sum + problem.centiseconds, 0);
        mean = sum / (recordProblemCount - 2 * trimCount);
      }
      if (mean < minMean) {
        minMean = mean;
        minMeanStartIndex = i;
        minMeanExcludedIndices = excludedIndices;
      }
    }
    minMeanExcludedIndices.sort(
      (firstIndex, secondIndex) => firstIndex - secondIndex
    );
    setBests.push({
      calculationMethod,
      problemCount: recordProblemCount,
      centiseconds: Math.round(minMean),
      startIndex: minMeanStartIndex,
      excludedIndices: minMeanExcludedIndices
    });
  }
  return setBests;
}
