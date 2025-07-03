import React from 'react';

export default function Timeline({ startDate, endDate }) {
  const endLabel = endDate || 'Current';
  return (
    <p className="timeline">
      <span className="timeline-point">
        <span className="dot" />
        <span className="label">{startDate}</span>
      </span>
      <span className="timeline-point">
        <span className="dot" />
        <span className="label">{endLabel}</span>
      </span>
    </p>
  );
}