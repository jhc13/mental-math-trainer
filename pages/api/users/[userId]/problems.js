import prisma from 'prisma/prisma';
import cuid from 'cuid';
import isUserAuthenticated from 'utils/auth';
import recordFormats from 'utils/records';
import { MAX_PROBLEMS_PER_SET } from 'utils/config';

function getSetBests(problems) {
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

async function getNewRecords(userId, problems, setBests) {
  const { operation, operandLengths } = problems[0];
  const records = await prisma.record.findMany({
    where: {
      userId,
      operation,
      operandLengths: {
        equals: operandLengths
      }
    },
    orderBy: {
      timestamp: 'desc'
    },
    distinct: ['calculationMethod', 'problemCount'],
    select: {
      calculationMethod: true,
      problemCount: true,
      centiseconds: true
    }
  });

  const newRecords = [];
  for (const best of setBests) {
    const {
      calculationMethod,
      problemCount,
      centiseconds,
      startIndex,
      excludedIndices
    } = best;
    const record = records.find(
      (record) =>
        record.calculationMethod === calculationMethod &&
        record.problemCount === problemCount
    );
    best.isNewRecord =
      record === undefined || centiseconds < record.centiseconds;
    if (best.isNewRecord) {
      newRecords.push({
        operation,
        operandLengths,
        calculationMethod,
        problemCount,
        centiseconds,
        problems: {
          connect: Array.from(
            { length: problemCount },
            (_, i) => i + startIndex
          ).map((index) => ({
            id: problems[index].id
          }))
        },
        excludedProblems: {
          connect: excludedIndices.map((index) => ({
            id: problems[index].id
          }))
        },
        user: {
          connect: {
            id: userId
          }
        }
      });
    }
  }
  return newRecords;
}

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!(await isUserAuthenticated(req, res, userId))) {
    return;
  }

  if (req.method === 'POST') {
    let problems = req.body;
    if (problems.length > MAX_PROBLEMS_PER_SET) {
      return res.status(422).end();
    }

    const setBests = getSetBests(problems);
    problems = problems.map((problem) => ({
      ...problem,
      id: cuid(),
      userId
    }));
    const newRecords = await getNewRecords(userId, problems, setBests);
    await prisma.$transaction([
      prisma.problem.createMany({
        data: problems
      }),
      ...newRecords.map((newRecord) =>
        prisma.record.create({
          data: newRecord
        })
      )
    ]);
    res.status(200).json(setBests);
  }
}
