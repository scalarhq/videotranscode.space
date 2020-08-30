import React from 'react';

type CellProps = { key: string, title: string, img: string, alt: string, text: string }

const Cell = (props: CellProps) => {
  const {
    key, title, img, alt, text,
  } = props;

  return (
    <article key={key} id={key}>
      <h1 className="major" style={{ color: 'white' }}>{title}</h1>
      <span className="image main"><img src={img} alt={alt} /></span>
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </article>
  );
};

export default Cell;
