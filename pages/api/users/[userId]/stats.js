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
      const records = await prisma.record.findMany({
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
          calculationMethod: true,
          problemCount: true,
          centiseconds: true
        }
      });
      const problemTypeStats = {
        problemCount: aggregations._count,
        centiseconds: aggregations._sum.centiseconds,
        records
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
