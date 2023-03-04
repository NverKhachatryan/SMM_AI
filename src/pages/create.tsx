/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/extensions */
// pages/create.tsx

import { Button, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Draft: React.FC = () => {
  const Router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { projectName, projectDescription };
      await fetch('/api/projectsall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/dashboard');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('errpr: ', error);
    }
  };

  return (
    <>
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
    </>
  );
};

export default Draft;
