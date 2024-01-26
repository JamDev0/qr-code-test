'use client';

import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { Result } from '@zxing/library';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import adapter from 'webrtc-adapter';
adapter;

function isMediaDevicesSupported() {
  const isMediaDevicesSupported =
    typeof navigator !== 'undefined' && !!navigator.mediaDevices;

  if (!isMediaDevicesSupported) {
    console.warn(
      `[ReactQrReader]: MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"`,
    );
  }

  return isMediaDevicesSupported;
}

interface QrReaderProps extends React.HTMLAttributes<HTMLDivElement> {
  constrains?: MediaTrackConstraints;
  scanDelay?: number;
  scanSuccessDelay?: number;
  onReadError?: (err: string) => void;
  onRead?: (result: Result) => void;
  read: boolean;
}

export const QrReader: React.FC<QrReaderProps> = ({
  className,
  constrains = { facingMode: 'environment', frameRate: 30 },
  scanDelay = 300,
  scanSuccessDelay = 3500,
  onReadError,
  onRead,
  read,
  children,
  ...props
}) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [controller, setController] = React.useState<
    IScannerControls | undefined
  >();

  React.useEffect(() => {
    if (!videoRef.current || !read || !!controller) {
      return;
    }

    if (!isMediaDevicesSupported()) {
      onReadError &&
        onReadError(
          'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"',
        );
    }

    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: scanDelay,
      delayBetweenScanSuccess: scanSuccessDelay,
    });

    codeReader
      .decodeFromConstraints(
        { video: constrains },
        videoRef.current,
        (result, error) => {
          result && onRead && onRead(result);

          error?.message && onReadError && onReadError(error?.message || '');
        },
      )
      .then(control => {
        setController(control);
      })
      .catch((error: Error) => {
        onReadError && onReadError(error.message);
      });
  }, [
    constrains,
    scanDelay,
    scanSuccessDelay,
    onReadError,
    onRead,
    read,
    controller,
  ]);

  React.useEffect(() => {
    if (!read) {
      controller?.stop();
      setController(undefined);
    }
  }, [controller, read]);

  return (
    <section
      className={twMerge('relative aspect-square h-auto w-full', className)}
      {...props}
    >
      <video
        muted
        className="h-full w-full object-cover data-[flip='true']:-scale-x-100"
        data-flip={constrains?.facingMode === 'user'}
        ref={videoRef}
      />
      {children}
    </section>
  );
};
QrReader.displayName = 'QrReader';

type QrViewFinderProps = React.SVGAttributes<HTMLOrSVGElement>;

export const QrViewFinder: React.FC<QrViewFinderProps> = ({
  className,
  ...props
}) => {
  return (
    <svg
      className={twMerge(
        'absolute left-0 top-0 z-10 h-full w-full border-[3rem] border-black/40 text-red-500',
        className,
      )}
      viewBox="0 0 100 100"
      {...props}
    >
      <path
        fill="none"
        d="M13,0 L0,0 L0,13"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M0,87 L0,100 L13,100"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M87,100 L100,100 L100,87"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M100,13 L100,0 87,0"
        stroke="currentColor"
        strokeWidth="5"
      />
    </svg>
  );
};
