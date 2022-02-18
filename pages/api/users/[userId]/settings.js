import prisma from 'prisma/prisma';

export default async function handler(req, res) {
  const { userId } = req.query;
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
