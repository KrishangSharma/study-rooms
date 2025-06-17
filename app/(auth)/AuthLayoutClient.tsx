'use client';

import type React from 'react';

import Image from 'next/image';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import FormImage from '@/public/Form_Image.svg';
import Link from 'next/link';

export default function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Left Column - Content */}
      <div className="relative w-full h-screen md:w-1/2 overflow-hidden">
        {/* Background Image */}
        <Image
          src={FormImage}
          alt="Abstract Illustration"
          fill
          className="object-cover w-full h-full"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-10" />

        {/* Content */}
        <div className="relative z-20 w-full h-full p-6 md:p-12 flex flex-col">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Link href="/" className="text-xl font-bold text-white">
                StudyioVibe
              </Link>
            </motion.div>
          </div>

          {/* Centered Text */}
          <div className="hidden md:flex h-full flex-col justify-center items-center flex-grow text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-md"
            >
              <h2 className="text-2xl md:text-5xl font-bold mb-4">Elevate Your Study Experience</h2>
              <p className=" text-white/90">
                Join thousands of students who are transforming the way they learn and collaborate
                with StudyioVibe.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 grid place-items-center ">
        <Suspense
          fallback={
            <div className="w-full max-w-md h-[400px] flex items-center justify-center">
              Loading...
            </div>
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
}
