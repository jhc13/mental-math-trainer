import { getSession } from 'next-auth/react';

export default async function isUserAuthenticated(req, res, userId) {
  const session = await getSession({ req });
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
