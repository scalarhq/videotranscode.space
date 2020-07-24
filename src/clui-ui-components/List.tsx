import React, { useEffect, useState } from 'react';

import ComponentStore from '../store/componentStore';

const { CluiStore } = ComponentStore;

const { updateConfiguration } = CluiStore;

/**
 * Element of a List displayed as buttons
 * Name and Value are self explanatory
 * The Child is another JSX.Element potentially another list,
 * which is displayed on choosing the parent element
 */

type ListElement = {
  name: string,
  value: string
  child?: JSX.Element
  [name: string]: any
}
/**
 * List Element is expected to receive the following properties
 * parents is a string of keys representing the hierarchy of the calling elements
 * Example, if Transcode Feature is calling this List for choosing the codec
 * we would get a parent array of ["TRANSCODE","FORMAT", "CODECS"]
 * Current is the default element of the list, which is selected by default
 */
type ListProps = {
  parents: Array<string>
  list: Array<ListElement>
  title: string
  current: ListElement
}

/**
 * Abstraction of a List Functional Component that can be used in the CLUI
 * @param props {@link ListProps}
 */

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
