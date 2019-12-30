import React, {
  useState,
  useReducer,
  useLayoutEffect,
} from 'react';
import { hot } from 'react-hot-loader'; // eslint-disable-line
import { BrowserRouter } from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';

import colorData from 'colors.json';
import sizeData from 'styles/sizes.json';

import ColorContext from 'contexts/Color';
import FontSizeContext from 'contexts/FontSize';
import SizeContext from 'contexts/Size';
import Toastr from './Toastr';
import Loading from './Loading';

import Context from './Context';
import { reducer, initialState, actions } from './reducer';


import Container from './Container';

const View = React.memo(() => {
  const [color, setColor] = useState(colorData);
  const [sizes, setSizes] = useState(sizeData);
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

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        actions,
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
          <SizeContext.Provider
            value={{
              sizes,
              onChange: (v) => setSizes(v),
            }}
          >
            <BrowserRouter>
              <Container />
            </BrowserRouter>
            <Toastr />
            <Loading />
          </SizeContext.Provider>
        </ColorContext.Provider>
      </FontSizeContext.Provider>
    </Context.Provider>
  );
});

export default process.env.NODE_ENV === 'development' ? hot(module)(View) : View;
