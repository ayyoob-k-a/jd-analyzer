'use client';

import type { Improvement } from '@/lib/types';

interface ImprovementCardsProps {
  improvements: Improvement[];
}

export default function ImprovementCards({ improvements }: ImprovementCardsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        How to Improve Your Resume
      </h2>
      <div className="flex flex-col gap-3">
        {improvements.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 items-start"
          >
            {/* Numbered circle */}
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            {/* Content */}
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
