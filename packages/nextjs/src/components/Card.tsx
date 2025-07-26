import { type ReactElement } from 'react';

interface CardArgs {
    title: string;
    stepNumber?: number;
    children: React.ReactNode;
}

export function Card({ title, stepNumber, children }: CardArgs): ReactElement {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold">
                {stepNumber && <span className="text-brand-pink mr-2">{stepNumber}.</span>}
                {title}
            </h2>
            {children}
        </div>
    );
}