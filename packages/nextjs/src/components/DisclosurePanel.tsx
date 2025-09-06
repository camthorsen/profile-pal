import { type ReactElement } from 'react';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

import { ChevronDownIcon, ChevronUpIcon } from './icons/index.ts';

export interface DisclosurePanelProps {
  title: string;
  description: string;
  stepNumber: number;
  children: ReactElement;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

export function DisclosurePanelComponent({
  title,
  description,
  stepNumber,
  children,
  isOpen = true,
  onToggle,
  className,
}: DisclosurePanelProps): ReactElement {
  return (
    <Disclosure as="div" className={className} defaultOpen={isOpen}>
      {({ open }) => {
        // Call onToggle when the state changes
        if (onToggle && open !== isOpen) {
          onToggle(open);
        }

        return (
          <>
            <DisclosureButton className="w-full text-left">
              <div className="flex items-start gap-4">
                {/* Step Number Circle */}
                <div className="flex-shrink-0 w-8 h-8 bg-brand-pink text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {stepNumber}
                </div>
                
                {/* Title and Description */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </div>
                
                {/* Chevron Icon */}
                <div className="flex-shrink-0 w-6 h-6 text-gray-500">
                  {open ? (
                    <ChevronUpIcon className="w-full h-full transition-opacity duration-200" />
                  ) : (
                    <ChevronDownIcon className="w-full h-full transition-opacity duration-200" />
                  )}
                </div>
              </div>
            </DisclosureButton>
            
            <div className="overflow-hidden">
              <DisclosurePanel
                transition
                className="origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
              >
                <div className="pt-4 pl-12">
                  {children}
                </div>
              </DisclosurePanel>
            </div>
          </>
        );
      }}
    </Disclosure>
  );
}
