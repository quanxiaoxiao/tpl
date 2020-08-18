/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx, css } from '@emotion/core';
import ReactDOM from 'react-dom';
import Item from './Item';
import useStore from '../useStore';

const Toastr = React.memo(() => {
  const { state, dispatch } = useStore();
  const { toastrList } = state;

  return ReactDOM.createPortal((
    <Fragment>
      <div
        css={css`
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 101;
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
                key={item._id}
                item={item}
                onRemove={dispatch.removeToastr}
              />
            ))
        }
      </div>
      {
        toastrList
          .filter((item) => item.position)
          .map((item) => (
            <Item
              key={item._id}
              item={item}
              onRemove={dispatch.removeToastr}
            />
          ))
      }
    </Fragment>
  ), document.body);
});

export default Toastr;
