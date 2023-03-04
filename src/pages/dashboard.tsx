/* eslint-disable import/no-named-as-default */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/rules-of-hooks */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Button, Card, TextInput } from 'flowbite-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GetStaticProps } from 'next';
import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import type { MetricType } from '@/components/DropDownMetric';
import DropDownMetric from '@/components/DropDownMetric';
import type { NarrativeType } from '@/components/DropDownNarrative';
import DropDownTargetNarrative from '@/components/DropDownNarrative';
import type { SizeType } from '@/components/DropDownSize';
import DropDownSize from '@/components/DropDownSize';
import type { TargetType } from '@/components/DropDownTarget';
import DropDownTarget from '@/components/DropDownTarget';
import LoadingDots from '@/components/LoadingDots';
// eslint-disable-next-line import/no-extraneous-dependencies
import Navbar from '@/components/navbar';
import ResizablePanel from '@/components/ResizablePanel';
import SidebarAside from '@/components/SidebarAside';

import { prisma } from '../../prisma/shared-client';
import type { GoalType } from '../components/DropDownGoals';
import DropDownGoals from '../components/DropDownGoals';
import type { MediaType } from '../components/DropDownMedia';
import DropDownMedia from '../components/DropDownMedia';

function dashboard() {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDesciption, setProductDescription] = useState('');
  const [target, setTarget] = useState<TargetType>('Acquisition');
  const [media, setMedia] = useState<MediaType>('Facebook');
  const [goals, setGoals] = useState<GoalType>('Brand awareness');
  const [metric, setMetric] = useState<MetricType>('None');
  const [narrative, setNarrative] = useState<NarrativeType>('None');
  const [size, setSize] = useState<SizeType>('Small');
  const [generatedBios, setGeneratedBios] = useState<String>('');

  console.log('Streamed response: ', generatedBios);

  const prompt =
    media === 'Instagram'
      ? `Write a creative ad for the ${productDesciption} to run on Instagram.
       \n\n Product: ${productName}${
          productName.slice(-1) === '.' ? '' : '.'
        } \n\n my goal is ${goals}
        \n\n my target is ${target}
        \n\n my metric is ${metric}
        \n\n my narrative is ${narrative}
        \n\n the length should be ${size}`
      : `Write a creative ad for the ${productDesciption} to run on ${media}. This product is for ${target}. \n\n Product: ${productName}${productName}${
          productName.slice(-1) === '.' ? '' : '.'
        }
        \n\n my goal is ${goals}
        \n\n my target is ${target}
        \n\n my metric is ${metric}
        \n\n my narrative is ${narrative}
        \n\n the length should be ${size}
        `;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios('');
    setLoading(true);
    const response = await fetch('/api/openai/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log('Edge function returned.');

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-row">
        <SidebarAside />
        <main className="mt-12 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mt-20">
          <div className="w-2/3">
            <div className="mb-1 flex items-center space-x-3">
              <p className="text-left font-medium">Enter your Product Name.</p>
            </div>
            <TextInput
              id="small"
              type="text"
              sizing="sm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
              value={productDesciption}
              onChange={(e) => setProductDescription(e.target.value)}
            />
            <div className="mb-1 mt-3 flex items-center space-x-3">
              <p className="text-left font-medium">Select your Platform.</p>
            </div>
            <div className="block">
              <DropDownMedia
                media={media}
                setMedia={(newMedia) => setMedia(newMedia)}
              />
            </div>

            <div className="mb-1 mt-3 flex items-center space-x-3">
              <p className="text-left font-medium">Select your Goal.</p>
            </div>
            <div className="block">
              <DropDownGoals
                goal={goals}
                setGoal={(newGoal) => setGoals(newGoal)}
              />
            </div>
            <div className="mb-1 mt-3 flex items-center space-x-3">
              <p className="text-left font-medium">
                Select your Metric (Optional).
              </p>
            </div>
            <div className="block">
              <DropDownMetric
                metric={metric}
                setMetric={(newMetric) => setMetric(newMetric)}
              />
            </div>
            <div className="mb-1 mt-3 flex items-center space-x-3">
              <p className="text-left font-medium">Select your Target</p>
            </div>
            <div className="block">
              <DropDownTarget
                target={target}
                setTarget={(newTarget) => setTarget(newTarget)}
              />
            </div>
            <div className="mb-1 mt-3 flex items-center space-x-3">
              <p className="text-left font-medium">Select Narrative type.</p>
            </div>
            <div className="block">
              <DropDownTargetNarrative
                narrative={narrative}
                setNarrative={(newTargetNarrative) =>
                  setNarrative(newTargetNarrative)
                }
              />
            </div>
            <div className="mb-1 mt-3 flex items-center space-x-3">
              <p className="text-left font-medium">Select length.</p>
            </div>
            <div className="block">
              <DropDownSize
                size={size}
                setSize={(newSize) => setSize(newSize)}
              />
            </div>

            {!loading && (
              <div className="mt-5 flex flex-col items-center justify-center space-y-3">
                <Button
                  className="items-center justify-center space-x-3"
                  size="xl"
                  onClick={(e) => generateBio(e)}
                >
                  Generate your post &rarr;
                </Button>
              </div>
            )}
            {loading && (
              <Button size="lg" disabled={true}>
                Generate your post
                <LoadingDots color="white" style="large" />
              </Button>
            )}
          </div>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <hr className="border-1 h-px bg-gray-700 dark:bg-gray-700" />
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="my-10 space-y-10">
                {generatedBios && !loading && (
                  <>
                    <div>
                      <h2 className="mx-auto text-3xl font-bold text-slate-900 sm:text-4xl">
                        Your generated bios
                      </h2>
                    </div>
                    <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-8">
                      {generatedBios
                        .substring(generatedBios.indexOf('0'))
                        .split('2.')
                        .map((generatedBio) => {
                          return (
                            <div
                              onClick={() => {
                                navigator.clipboard.writeText(generatedBio);
                                toast('Bio copied to clipboard', {
                                  icon: '✂️',
                                });
                              }}
                              key={generatedBio}
                            >
                              <Card>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                  {generatedBio}
                                </p>
                              </Card>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </ResizablePanel>
        </main>
      </div>
    </>
  );
}

export default dashboard;

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.project.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};
