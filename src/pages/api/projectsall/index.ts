/* eslint-disable import/no-extraneous-dependencies */
// pages/api/post/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '../../../../prisma/shared-client';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectName, projectDescription } = req.body;

  const session = await getSession({ req });
  const result = await prisma.project.create({
    data: {
      projectName,
      projectDescription,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
