import { Card } from 'flowbite-react';
import type { GetServerSidePropsContext, PreviewData } from 'next';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';

import Navbar from '@/components/navbar';
import SidebarAside from '@/components/SidebarAside';

import { prisma } from '../../../prisma/shared-client';

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  const project = await prisma.project.findUnique({
    where: {
      id: String(params?.id),
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
  const Router = useRouter();
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <SidebarAside />
        <div className="ml-2 max-w-sm">
          <div onClick={() => Router.push('/[pid]', `/${props.project?.id}`)}>
            <Card imgSrc="https://www.mhpcolorado.org/wp-content/uploads/2021/02/TS-FB-Icon-300x300.png">
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Generate Content for Facebook
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
