import React from 'react';

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

type MatchSubStringProps = {
  source: string,
  match: string,
};

const MatchSubString: React.FC<MatchSubStringProps> = ({ source, match }: MatchSubStringProps) => {
  if (!source.toLowerCase().includes(match.toLowerCase())) {
    return <>{source}</>;
  }

  const [start, end] = source.split(new RegExp(`${escapeRegExp(match)}(.+)?`, 'i'));

  return <>{[start, <b key={match}>{source.substr(start.length, match.length)}</b>, end]}</>;
};

export default MatchSubString;
