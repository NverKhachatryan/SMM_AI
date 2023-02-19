/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable simple-import-sort/imports */
import Image from 'next/image';
import React from 'react';
import Container from './container';

export default function Benefits(props: { imgPos?: any; data?: any }) {
  const { data } = props;

  return (
    <>
      <Container className="mb-20 flex flex-wrap lg:flex-nowrap lg:gap-10 ">
        <div
          className={`flex w-full items-center justify-center lg:w-1/2 ${
            props.imgPos === 'right' ? 'lg:order-1' : ''
          }`}
        >
          <div>
            <Image
              src={data.image}
              width="521"
              height="482"
              alt="Benefits"
              layout="intrinsic"
              placeholder="blur"
            />
          </div>
        </div>

        <div
          className={`flex w-full flex-wrap items-center lg:w-1/2 ${
            props.imgPos === 'right' ? 'lg:justify-end' : ''
          }`}
        >
          <div>
            <div className="mt-4 flex w-full flex-col">
              <h3 className="mt-3 max-w-2xl text-3xl font-bold leading-snug tracking-tight text-gray-800 dark:text-white lg:text-4xl lg:leading-tight">
                {data.title}
              </h3>

              <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 dark:text-gray-300 lg:text-xl xl:text-xl">
                {data.desc}
              </p>
            </div>

            <div className="mt-5 w-full">
              {data.bullets.map(
                (item: { title: any; icon: any; desc: any }, index: any) => (
                  <Benefit key={index} title={item.title} icon={item.icon}>
                    {item.desc}
                  </Benefit>
                )
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

function Benefit(props: {
  icon: React.DetailedReactHTMLElement<{ className: string }, HTMLElement>;
  title:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {
  return (
    <>
      <div className="mt-8 flex items-start space-x-3">
        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-indigo-500 ">
          {React.cloneElement(props.icon, {
            className: 'w-7 h-7 text-indigo-50',
          })}
        </div>
        <div>
          <h4 className="text-xl font-medium text-gray-800 dark:text-gray-200">
            {props.title}
          </h4>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {props.children}
          </p>
        </div>
      </div>
    </>
  );
}
