import prisma from 'prisma/prisma';
import isUserAuthenticated from 'utils/auth';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!(await isUserAuthenticated(req, res, userId))) {
    return;
  }

  if (req.method === 'DELETE') {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    });
    res.status(200).json(deletedUser);
  }
}
