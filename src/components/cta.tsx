/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import Container from './container';

export default function Cta() {
  return (
    <Container>
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-5 rounded-xl bg-indigo-600 p-7 text-white lg:flex-nowrap lg:p-12">
        <div className="grow text-center lg:text-left">
          <h2 className="text-2xl font-medium lg:text-3xl">
            Ready to try-out this template?
          </h2>
          <p className="mt-2 font-medium text-white text-opacity-90 lg:text-xl">
            Don't let your visitors see a poor landing.
          </p>
        </div>
        <div className="w-full shrink-0 text-center lg:w-auto">
          <a
            href="https://github.com/web3templates"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto inline-block rounded-md bg-white py-3 px-7 text-center text-lg font-medium text-indigo-600 lg:px-10 lg:py-5 "
          >
            Download for Free
          </a>
        </div>
      </div>
    </Container>
  );
}
