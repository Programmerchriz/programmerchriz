import React from "react";

interface WorkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  period?: string;
  company?: string;
}

const WorkCard: React.FC<WorkCardProps> = ({
  icon,
  title,
  description,
  period,
  company,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 text-cyan-200 mt-1">{icon}</div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          {period && (
            <span className="text-sm text-cyan-200 bg-blue-900/30 px-3 py-1 rounded-full">
              {period}
            </span>
          )}
          {company && (
            <span className="text-sm font-semibold text-gray-300">
              {company}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default WorkCard;
