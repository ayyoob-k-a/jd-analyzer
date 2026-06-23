'use client';

interface KeywordTagsProps {
  keywords: string[];
}

export default function KeywordTags({ keywords }: KeywordTagsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Missing Keywords</h2>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        {keywords.length} skill{keywords.length !== 1 ? 's' : ''} from the JD
        not found in your resume
      </p>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-3 py-1 text-sm font-medium"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
