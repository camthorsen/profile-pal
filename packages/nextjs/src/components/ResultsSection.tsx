import type { ProfileResponse } from 'pet-profiler-ai-host/types';
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
    <section className="mt-8 border-t pt-6 space-y-6" aria-labelledby="results-heading">
      <h2 id="results-heading" className="sr-only">Generated Results</h2>
      
      <div className="flex flex-col gap-3">
        <H2>Generated Tags:</H2>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Generated tags">
          {responseData.clipScores.map(({ label }) => (
            <Chip key={label} label={label} />
          ))}
        </div>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">Show raw tag scores</summary>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600" role="list">
            {responseData.clipScores.map(({ label, score }) => (
              <li key={label}>
                {label} ({score})
              </li>
            ))}
          </ul>
        </details>
      </div>
      
      <div className="flex flex-col gap-3">
        <H2>Transcribed Audio:</H2>
        <div className="px-4 border-l-2 border-neutral-300">
          <blockquote className="text-gray-700 italic" cite="User audio input">
            "{responseData.transcript}"
          </blockquote>
        </div>
      </div>

      <Card title="Generated Profile Summary:">
        <div className="flex">
          <label htmlFor="summary" className="sr-only">
            Editable profile summary
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={5}
            value={editableSummary}
            onChange={(e) => onSummaryChange(e.target.value)}
            aria-describedby="summary-help"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
          />
        </div>
        <p id="summary-help" className="text-sm text-gray-600 mt-1">
          You can edit the generated summary before copying it.
        </p>
        <div className="flex mt-4">
          <CopyToClipboardButton text={editableSummary} buttonText="Copy Summary" successText="Copied!" />
        </div>
      </Card>
    </section>
  );
}
