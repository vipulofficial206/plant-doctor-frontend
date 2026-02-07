import React from 'react';

interface ResultCardProps {
  title: string;
  content: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content }) => {
  const formattedContent = React.useMemo(() => {
    if (!content) return [];
    // Normalize newlines and split by '*' which seems to be the list item marker in the API response
    return content.replace(/\\n/g, '\n').split(/\n\s*\*\s*/).filter(item => item.trim() !== '' && !item.toLowerCase().includes('here are the'));
  }, [content]);

  return (
    <div className="bg-white/30 p-5 rounded-lg border border-[var(--border-color)] h-full relative overflow-hidden backdrop-blur-sm">
       <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[var(--primary-accent)] to-transparent opacity-70"></div>
      <h4 className="text-lg font-semibold text-[var(--primary-accent)] mb-3">{title}</h4>
      {formattedContent.length > 0 ? (
        <ul className="space-y-2">
          {formattedContent.map((item, index) => {
            // Split by '**' to find bolded parts
            const parts = item.split(/(\*\*.*?\*\*)/g);
            return (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-[var(--primary-accent)] mr-3 mt-1">&#10003;</span>
                <p>
                    {parts.map((part, i) =>
                        part.startsWith('**') && part.endsWith('**') ?
                        <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> :
                        part.replace(/"/g, '')
                    )}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No information available.</p>
      )}
    </div>
  );
};

export default ResultCard;