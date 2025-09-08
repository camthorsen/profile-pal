import type { ProfileResponse } from 'pet-profiler-api';
import { type ReactElement } from 'react';

import { Card } from '@/components/Card.tsx';
import { Chip } from '@/components/Chip.tsx';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton.tsx';
import { H2 } from '@/components/typography/H2.tsx';


interface ResultsSectionProps {
  responseData: ProfileResponse | null;
  editableSummary: string;
  onSummaryChange: (summary: string) => void;
}

export function ResultsSection({ 
  responseData, 
  editableSummary, 
  onSummaryChange 
}: ResultsSectionProps): ReactElement | null {
  if (!responseData) return null;

  return (
    <div className="mt-8 border-t pt-6 space-y-6">
      <div className="flex flex-col gap-3">
        <H2>Generated Tags:</H2>
        <div className="flex flex-wrap gap-2">
          {responseData.clipScores.map(({ label }) => (
            <Chip key={label} label={label} />
          ))}
        </div>
        <p>Raw tag scores:</p>
        <ul className="list-disc list-inside -mt-2">
          {responseData.clipScores.map(({ label, score }) => (
            <li key={label}>
              {label} ({score})
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex flex-col gap-3">
        <H2>Transcribed Audio:</H2>
        <div className="px-4 border-l-2 border-neutral-300">
          <p className="text-gray-700 italic">"{responseData.transcript}"</p>
        </div>
      </div>

      <Card title="Generated Profile Summary:">
        <div className="flex">
          <textarea
            id="summary"
            name="summary"
            rows={5}
            value={editableSummary}
            onChange={(e) => onSummaryChange(e.target.value)}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
          />
        </div>
        <div className="flex mt-4">
          <CopyToClipboardButton text={editableSummary} buttonText="Copy Summary" successText="Copied!" />
        </div>
      </Card>
    </div>
  );
}
