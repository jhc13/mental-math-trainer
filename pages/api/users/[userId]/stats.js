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
      let problemTypeStats = await prisma.problem.aggregate({
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
      problemTypeStats = {
        problemCount: problemTypeStats._count,
        centiseconds: problemTypeStats._sum.centiseconds
      };
      res.status(200).json(problemTypeStats);
    } else {
      let totalStats = await prisma.problem.aggregate({
        _count: true,
        _sum: {
          centiseconds: true
        },
        where: {
          userId
        }
      });
      totalStats = {
        totalProblemCount: totalStats._count,
        totalCentiseconds: totalStats._sum.centiseconds
      };
      res.status(200).json(totalStats);
    }
  }
}
