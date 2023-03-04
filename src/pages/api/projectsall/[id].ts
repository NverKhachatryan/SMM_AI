import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../../prisma/shared-client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id as string;
  const post = await prisma.project.update({
    where: { id: postId },
    data: { published: true },
  });
  res.json(post);
}
