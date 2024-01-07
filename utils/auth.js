import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function isUserAuthenticated(req, res, userId) {
  const session = await getServerSession(req, res, authOptions);
  if (session === null) {
    res.status(401).end();
    return false;
  }
  if (session.user.id !== userId) {
    res.status(403).end();
    return false;
  }
  return true;
}
