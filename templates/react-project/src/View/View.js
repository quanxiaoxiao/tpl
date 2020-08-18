import React, {
  useState,
  useReducer,
  useLayoutEffect,
  useMemo,
} from 'react';
import { hot } from 'react-hot-loader'; // eslint-disable-line
import { BrowserRouter } from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';

import colorData from 'colors.json';

import ColorContext from 'contexts/Color';
import FontSizeContext from 'contexts/FontSize';
import Toastr from './Toastr';
import Loading from './Loading';

import Context from './Context';
import { reducer, initialState, actions } from './reducer';

import Container from './Container';

const View = React.memo(() => {
  const [color, setColor] = useState(colorData);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fontSize, setFontSize] = useState(parseFloat(getComputedStyle(document.body).fontSize)); // eslint-disable-line

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver(() => {
      const newFontSize = parseFloat(getComputedStyle(document.body).fontSize);
      if (newFontSize !== fontSize) {
        animationFrameID = window.requestAnimationFrame(() => {
          setFontSize(newFontSize);
        });
      }
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  const _state = useMemo(() => ({
    ...state,
  }), [state]);

  const _dispatch = useMemo(() => Object
    .keys(actions)
    .reduce((acc, actionName) => ({
      ...acc,
      [actionName]: (payload) => dispatch(actions[actionName](payload)),
    }), {}), []);

  return (
    <Context.Provider
      value={{
        state: _state,
        dispatch: _dispatch,
      }}
    >
      <FontSizeContext.Provider
        value={fontSize}
      >
        <ColorContext.Provider
          value={{
            data: color,
            onChange: (v) => setColor(v),
          }}
        >
          <BrowserRouter>
            <Container />
          </BrowserRouter>
          <Toastr />
          <Loading />
        </ColorContext.Provider>
      </FontSizeContext.Provider>
    </Context.Provider>
  );
});

export default process.env.NODE_ENV === 'development' ? hot(module)(View) : View;
