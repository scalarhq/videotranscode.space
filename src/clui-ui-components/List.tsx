import React, { useEffect, useState } from 'react';

import ComponentStore from '../store/componentStore';

import './list.css';

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
  value: any
  child?: {
    component: any,
    props: any
    paddingTop?: number
  }
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
  const [current, setCurrent] = useState<ListElement>(props.current);

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

    <div className="options-list-wrapper">
      <h1>{title}</h1>
      <div className="options-list">
        {list.map((item) => (
          <div className="options-list-item-wrapper" key={item.name}>
            <div
              className={item.name === current.name ? 'options-list-item active' : 'options-list-item'}
            >

              <button type="button" onClick={(e) => handleClick(e, item)}>{item.name}</button>
            </div>
          </div>
        ))}
      </div>
      {current.child && (
        <div className="child">
          <current.child.component {...current.child.props} />

        </div>
      )}
      {/* @ts-ignore Styled JSX */}
      <style jsx>
        {`
          .child {
            padding-top: ${current.child && current.child.paddingTop ? current.child.paddingTop : 0}%
          }
         
        `}
      </style>
    </div>

  );
};

export default List;
