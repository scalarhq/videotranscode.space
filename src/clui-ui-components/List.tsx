import React, { useEffect, useState } from 'react';

import ComponentStore from '../store/componentStore';

const { CluiStore } = ComponentStore;

const { updateConfiguration } = CluiStore;

type ListElement = {
  name: string,
  value: string
  child?: JSX.Element
  [name: string]: any
}

type ListProps = {
  parents: Array<string>
  list: Array<ListElement>
  title: string
  current: ListElement
}

const List = (props: ListProps) => {
  const { list, title, parents } = props;

  // eslint-disable-next-line react/destructuring-assignment
  const [current, setCurrent] = useState(props.current);

  useEffect(() => {
    const defaultConfiguration = { name: current.name, value: current.value };
    updateConfiguration(defaultConfiguration, [...parents]);
  }, []);

  const handleClick = (e: React.MouseEvent, element: ListElement) => {
    e.preventDefault();
    setCurrent(element);
    const newConfiguration = { name: element.name, value: element.value };
    updateConfiguration(newConfiguration, [...parents]);
  };

  return (
    <>
      <div className="options-list-wrapper">
        <h1>{title}</h1>
        <div className="options-list">
          {list.map((item) => (
            <div className="options-list-item-wrapper">
              <div
                className={item.name === current.name ? 'options-list-item active' : 'options-list-item'}
              >

                <button type="button" onClick={(e) => handleClick(e, item)}>{item.name}</button>
              </div>
            </div>
          ))}
        </div>
        {/* @ts-ignore */}
        <style jsx>
          {`
         .options-list-wrapper h1 {
            color: #959cb4;
          }

          .options-list-wrapper {
            display: flex;
            flex: 2 0 50%;
            padding: 1rem;
            flex-wrap: wrap;
            flex-direction: column;
          }

          .options-list {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }

          .options-list-item-wrapper {
            flex: 1 1 30%;
            padding-left: 10%;
          }

          .options-list-item {
            flex: 0 0 auto;
            color: #959cb4;
            padding: 0.4rem;
            border-radius: 5px;
            width: 100%;
          }

          .options-list-item.active {
            flex: 0 0 auto;
            background-color: rgba(62, 187, 112, 0.25);
            border: 1px solid #47b372;
            color: #f7f7f7;
            width: 100%;
          }

          .options-list-item a {
            color: inherit;
            padding-left: 3%;
          }

          .options-list-item a:hover {
            cursor: pointer;
          }
        `}
        </style>
        {current.child ? current.child : null}
      </div>
    </>
  );
};

export default List;
