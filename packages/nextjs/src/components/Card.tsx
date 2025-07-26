import { type ReactElement } from 'react';

import { H2 } from './typography/H2.tsx';

interface CardArgs {
    title: string;
    stepNumber?: number;
    description?: string;
    children: React.ReactNode;
}

export function Card({ title, stepNumber, description, children }: CardArgs): ReactElement {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex gap-4">
            {stepNumber && (
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-brand-pink flex items-center justify-center">
                        <span className="text-brand-pink font-bold text-xl">{stepNumber}</span>
                    </div>
                </div>
            )}
            <div className="flex-1">
                <H2 className="mb-2">{title}</H2>
                {description && (
                    <p className="text-gray-600 mb-4">{description}</p>
                )}
                {children}
            </div>
        </div>
    );
}