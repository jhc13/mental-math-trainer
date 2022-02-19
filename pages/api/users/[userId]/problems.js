import prisma from 'prisma/prisma';
import isUserAuthenticated from 'utils/auth';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!(await isUserAuthenticated(req, res, userId))) {
    return;
  }

  if (req.method === 'POST') {
    const problems = req.body;
    const updatedSettings = await prisma.problem.createMany({
      data: problems.map((problem) => ({ ...problem, userId }))
    });
    res.status(200).json(updatedSettings);
  }
}
