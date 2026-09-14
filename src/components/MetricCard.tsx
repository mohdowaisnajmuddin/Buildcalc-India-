import React from 'react';

interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  compactValue?: string;
  sublabel?: string;
  isAccent?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  compactValue,
  sublabel,
  isAccent = false,
}) => {
  return (
    <div
      id={id}
      className={`relative rounded-xl p-4 sm:p-5 transition-all border ${
        isAccent
          ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm'
          : 'bg-[#16161b] text-white border-[#272730]'
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <span
          className={`text-[11px] uppercase tracking-wider font-normal ${
            isAccent ? 'text-neutral-900 font-normal' : 'text-neutral-400'
          }`}
        >
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-2xl sm:text-3xl font-medium tracking-tight ${
              isAccent ? 'text-neutral-950' : 'text-white'
            }`}
          >
            {value}
          </span>
          {compactValue && (
            <span
              className={`text-xs font-normal ${
                isAccent ? 'text-neutral-800' : 'text-neutral-400'
              }`}
            >
              ({compactValue})
            </span>
          )}
        </div>
        {sublabel && (
          <span
            className={`text-[11px] font-normal mt-0.5 leading-snug ${
              isAccent ? 'text-neutral-900' : 'text-neutral-400'
            }`}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
