import prisma from 'prisma/prisma';
import cuid from 'cuid';
import isUserAuthenticated from 'utils/auth';
import { getSetBests } from 'utils/records';
import { MAX_PROBLEMS_PER_SET } from 'utils/config';

export default async function handler(req, res) {
  let { userId, operation, operandLengths } = req.query;
  if (operandLengths) {
    operandLengths = JSON.parse(operandLengths);
  }

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
  } else if (req.method === 'DELETE') {
    if (operation && operandLengths) {
      await prisma.$transaction([
        prisma.problem.deleteMany({
          where: {
            userId,
            operation,
            operandLengths: {
              equals: operandLengths
            }
          }
        }),
        prisma.record.deleteMany({
          where: {
            userId,
            operation,
            operandLengths: {
              equals: operandLengths
            }
          }
        })
      ]);
      res.status(204).end();
    } else if (!operation && !operandLengths) {
      await prisma.$transaction([
        prisma.problem.deleteMany({
          where: {
            userId
          }
        }),
        prisma.record.deleteMany({
          where: {
            userId
          }
        })
      ]);
      res.status(204).end();
    }
  }
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
