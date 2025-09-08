import { H2 } from '@/components/typography/H2.tsx';

interface TipsProps {
  className?: string;
}

export function Tips({ className }: TipsProps) {
  return (
    <div className={`rounded-lg shadow-md flex flex-col bg-brand-orange p-6 ${className || ''}`}>
      <H2 className="mb-2">Audio Recording Tips</H2>
      <p className="mb-4">Focus on the facts and briefly mention the following:</p>
      <ul className="list-disc list-outside px-6">
        <li>
          <strong>Age</strong>, <strong>breed</strong>, and <strong>size</strong> of the animal
        </li>
        <li>
          Spay/neuter status, health conditions, and <strong>special needs</strong> (e.g., only cat in the house)
        </li>
        <li>
          <strong>Rescue circumstances</strong> (e.g., owner surrendered, rescued from a hoarding situation, etc.)
        </li>
        <li>
          <strong>Distinct traits</strong>, behavioural characteristics (e.g., loves to play fetch, loves to cuddle)
        </li>
      </ul>
    </div>
  );
}
