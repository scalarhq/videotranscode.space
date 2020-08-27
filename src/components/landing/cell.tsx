import React from 'react';

export default ({
  key, title, img, alt, text,
}: { key: string, title: string, img: string, alt: string, text: string }) => (
    <article key={key} id={key}>
      <h2 className="major">{title}</h2>
      <span className="image main"><img src={img} alt={alt} /></span>
      <p>{text}</p>
    </article>
  );
