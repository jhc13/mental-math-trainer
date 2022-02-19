import prisma from 'prisma/prisma';
import isUserAuthenticated from 'utils/auth';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!(await isUserAuthenticated(req, res, userId))) {
    return;
  }

  if (req.method === 'GET') {
    const settings = await prisma.settings.findUnique({
      where: {
        userId
      }
    });
    if (settings) {
      res.status(200).json(settings);
    } else {
      res.status(404).end();
    }
  } else if (req.method === 'PUT') {
    const settings = req.body;
    const updatedSettings = await prisma.settings.upsert({
      where: {
        userId
      },
      update: {
        ...settings
      },
      create: {
        ...settings,
        userId
      }
    });
    res.status(200).json(updatedSettings);
  }
}
