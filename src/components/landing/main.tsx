import React, { useState, useEffect } from 'react';
import Cell from './cell';
import FormCell from './formCell';

const Main = (props: { children: JSX.Element[] }) => {
  const [state, setState] = useState<{ cells: JSX.Element[] | null }>({ cells: null });

  useEffect(() => {
    if (props.children) {
      const cells = props.children.map((child) => {
        if (child.props.title.toLowerCase() === 'contact') {
          const newProps = {
            action: child.props.action,
          };
          return FormCell(newProps);
        }
        const newProps = {
          title: child.props.title,
          text: child.props.text,
          img: child.props.img,
          alt: child.props.alt,
          key: child.props.id,
        };
        return Cell(newProps);
      });
      setState({ cells });
    }
  }, []);

  return (
    <div id="main">
      {state.cells}
    </div>
  );
};
export default Main;
