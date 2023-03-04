/* eslint-disable import/no-extraneous-dependencies */
import { TextInput } from 'flowbite-react';
import type { GetServerSidePropsContext, PreviewData } from 'next';
import { getSession } from 'next-auth/react';
import type { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';

import Navbar from '@/components/navbar';
import SidebarAside from '@/components/SidebarAside';

import { prisma } from '../../prisma/shared-client';

export const getServerSideProps = async ({
  params,
  req,
  res,
}: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }
  const project = await prisma.project.findUnique({
    where: {
      id: String(params?.pid),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { project },
  };
};

export type Props = {
  project: {
    id: string;
    projectName: string;
    projectDescription: string;
    published: boolean;
  };
};

const Project: React.FC<Props> = (props) => {
  const [projecttName, setProjectName] = useState(props.project?.projectName);
  const [projectDesciption, setProjectDesciption] = useState(
    props.project?.projectDescription
  );
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <SidebarAside />
        <div className="w-2/3">
          <div className="mb-1 flex items-center space-x-3">
            <p className="text-left font-medium">Enter your Product Name.</p>
          </div>
          <TextInput
            id="small"
            type="text"
            sizing="sm"
            value={projecttName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={projecttName}
          />
          <div className="mb-1 mt-3 flex items-center space-x-3">
            <p className="text-left font-medium">
              Enter your Product Description.
            </p>
          </div>
          <TextInput
            id="large"
            type="text"
            sizing="lg"
            value={projectDesciption}
            onChange={(e) => setProjectDesciption(e.target.value)}
            placeholder={projectDesciption}
          />
        </div>
      </div>
    </div>
  );
};

export default Project;
