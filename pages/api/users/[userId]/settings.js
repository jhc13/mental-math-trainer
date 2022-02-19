import { getSession } from 'next-auth/react';
import prisma from 'prisma/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { userId } = req.query;
  if (session === null) {
    return res.status(401).end();
  }
  if (session.user.id !== userId) {
    return res.status(403).end();
  }

  if (req.method === 'GET') {
    const settings = await prisma.settings.findUnique({
      where: {
        userId
      }
    });
    res.status(200).json(settings);
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
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    res.status(200).json(updatedSettings);
  }
}
