/** @jsx jsx */
import React, { Fragment, useContext } from 'react';
import { jsx, css } from '@emotion/core';
import ReactDOM from 'react-dom';
import Context from 'View/Context';
import Item from './Item';

const Toastr = React.memo(() => {
  const { state } = useContext(Context);
  const { toastrList } = state;

  return ReactDOM.createPortal((
    <Fragment>
      <div
        css={css`
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 999;
          > div:not(:last-child) {
            margin-bottom: 0.8rem;
          }
        `}
      >
        {
          toastrList
            .filter((item) => !item.position)
            .map((item) => (
              <Item
                key={item.id}
                id={item.id}
                type={item.type}
                duration={item.duration}
                message={item.message}
              />
            ))
        }
      </div>
      {
        toastrList
          .filter((item) => item.position)
          .map((item) => (
            <Item
              position={item.position}
              duration={item.duration}
              key={item.id}
              id={item.id}
              type={item.type}
              message={item.message}
            />
          ))
      }
    </Fragment>
  ), document.body);
});

export default Toastr;
