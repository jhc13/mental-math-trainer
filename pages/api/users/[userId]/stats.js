import prisma from 'prisma/prisma';
import isUserAuthenticated from 'utils/auth';

export default async function handler(req, res) {
  let { userId, operation, operandLengths } = req.query;
  if (operandLengths) {
    operandLengths = JSON.parse(operandLengths);
  }
  if (!(await isUserAuthenticated(req, res, userId))) {
    return;
  }

  if (req.method === 'GET') {
    if (operation && operandLengths) {
      const aggregations = await prisma.problem.aggregate({
        _count: true,
        _sum: {
          centiseconds: true
        },
        where: {
          userId,
          operation,
          operandLengths: {
            equals: operandLengths
          }
        }
      });
      const currentRecords = await prisma.record.findMany({
        where: {
          userId,
          operation,
          operandLengths: {
            equals: operandLengths
          }
        },
        orderBy: [
          {
            problemCount: 'asc'
          },
          {
            timestamp: 'desc'
          }
        ],
        distinct: ['calculationMethod', 'problemCount'],
        select: {
          timestamp: true,
          calculationMethod: true,
          problemCount: true,
          centiseconds: true,
          problems: {
            select: {
              id: true,
              operation: true,
              operands: true,
              centiseconds: true
            }
          },
          excludedProblems: {
            select: {
              id: true
            }
          }
        }
      });
      const allRecords = await prisma.record.findMany({
        where: {
          userId,
          operation,
          operandLengths: {
            equals: operandLengths
          }
        },
        orderBy: [
          {
            timestamp: 'asc'
          }
        ],
        select: {
          timestamp: true,
          calculationMethod: true,
          problemCount: true,
          centiseconds: true
        }
      });
      const recordProgressions = getRecordProgressions(allRecords);
      const problemTypeStats = {
        problemCount: aggregations._count,
        centiseconds: aggregations._sum.centiseconds,
        records: currentRecords,
        recordProgressions
      };
      res.status(200).json(problemTypeStats);
    } else {
      const aggregations = await prisma.problem.aggregate({
        _count: true,
        _sum: {
          centiseconds: true
        },
        where: {
          userId
        }
      });
      const totalStats = {
        totalProblemCount: aggregations._count,
        totalCentiseconds: aggregations._sum.centiseconds
      };
      res.status(200).json(totalStats);
    }
  }
}

function getRecordProgressions(records) {
  return records.reduce((recordProgressions, record) => {
    let progression = recordProgressions.find(
      (progression) =>
        progression.calculationMethod === record.calculationMethod &&
        progression.problemCount === record.problemCount
    );
    if (!progression) {
      progression = {
        calculationMethod: record.calculationMethod,
        problemCount: record.problemCount,
        records: []
      };
      recordProgressions.push(progression);
    }
    progression.records.push({
      timestamp: record.timestamp,
      centiseconds: record.centiseconds
    });
    return recordProgressions;
  }, []);
}
