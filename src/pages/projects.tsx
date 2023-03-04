/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable import/no-extraneous-dependencies */
// pages/drafts.tsx

import { Button, Card, Label, Modal, TextInput } from 'flowbite-react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import React from 'react';

import Navbar from '@/components/navbar';
import SidebarAside from '@/components/SidebarAside';

import { prisma } from '../../prisma/shared-client';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.project.findMany({
    where: {
      author: { email: session.user?.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

export type Props = {
  drafts: {
    id: string;
    projectName: string;
    projectDescription: string;
    published: boolean;
  }[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const Router = useRouter();
  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [show, setShow] = React.useState(false);

  const onClick = () => {
    setShow(true);
  };

  const onClose = () => {
    setShow(false);
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { projectName, projectDescription };
      await fetch('/api/projectsall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/projects');
      setShow(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('errpr: ', error);
    }
  };

  if (!session) {
    return (
      <>
        <h1>My Drafts</h1>
        <p>You need to be signed in to view this page.</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-row">
        <SidebarAside />
        <div className="flex flex-row flex-wrap justify-center">
          <Card
            imgSrc="https://img.freepik.com/premium-vector/add-new-project-icon-web-apps_116137-1284.jpg"
            className="inline-block max-w-sm"
            onClick={onClick}
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create New Project
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Create New Project
            </p>
          </Card>
          {props.drafts.map((project, index) => (
            <div
              className={
                index <= 3
                  ? 'm-1 inline-block max-w-sm'
                  : 'm-1 inline-block max-w-sm'
              }
              key={project.id}
            >
              <div
                onClick={() =>
                  Router.push('projects/[id]', `projects/${project.id}`)
                }
              >
                <Card
                  imgSrc="https://flowbite.com/docs/images/blog/image-1.jpg"
                  className="max-w-sm"
                >
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {project.projectName}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {project.projectDescription}
                  </p>
                </Card>
              </div>
            </div>
          ))}
        </div>
        <Modal show={show} size="md" popup={true} onClose={onClose}>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Create a new project
              </h3>
              <form className="flex flex-col gap-4" onSubmit={submitData}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Project Name" />
                  </div>
                  <TextInput
                    id="text12"
                    type="text"
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectName}
                    required={true}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="description" value="Project Description" />
                  </div>
                  <TextInput
                    id="text1"
                    type="text"
                    onChange={(e) => setProjectDescription(e.target.value)}
                    value={projectDescription}
                    required={true}
                  />
                </div>
                <Button type="submit" value="Create">
                  Submit
                </Button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Drafts;
