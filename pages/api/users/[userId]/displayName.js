import prisma from 'prisma/prisma';
import isUserAuthenticated from 'utils/auth';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!(await isUserAuthenticated(req, res, userId))) {
    return;
  }

  if (req.method === 'GET') {
    const displayName = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        displayName: true
      }
    });
    res.status(200).json(displayName);
  } else if (req.method === 'PUT') {
    const updatedDisplayName = await prisma.user.update({
      where: {
        id: userId
      },
      data: req.body,
      select: {
        displayName: true
      }
    });
    res.status(200).json(updatedDisplayName);
  }
}
