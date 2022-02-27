import prisma from 'prisma/prisma';
import isUserAuthenticated from 'utils/auth';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!(await isUserAuthenticated(req, res, userId))) {
    return;
  }

  if (req.method === 'GET') {
    const stats = await prisma.problem.aggregate({
      _count: true,
      _sum: {
        centiseconds: true
      },
      where: {
        userId
      }
    });
    res.status(200).json(stats);
  }
}
