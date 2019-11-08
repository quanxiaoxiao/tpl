import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader'; // eslint-disable-line
import { BrowserRouter } from 'react-router-dom';

import colorData from 'styles/colors.json';
import sizeData from 'styles/sizes.json';

import ColorContext from 'contexts/Color';
import FontSizeContext from 'contexts/FontSize';
import SizeContext from 'contexts/Size';


import Container from './Container';

const View = React.memo(() => {
  const [colors, setColors] = useState(colorData);
  const [sizes, setSizes] = useState(sizeData);
  const [fontSize, setFontSize] = useState(parseFloat(getComputedStyle(document.body).fontSize)); // eslint-disable-line

  useEffect(() => {
    window.addEventListener('resize', () => {
      setFontSize(parseFloat(getComputedStyle(document.body).fontSize));
    });
    setTimeout(() => {
      const resizeEvent = window.document.createEvent('UIEvents');
      resizeEvent.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(resizeEvent);
    }, 60);
  }, []);

  return (
    <FontSizeContext.Provider
      value={fontSize}
    >
      <ColorContext.Provider
        value={{
          colors,
          onChange: (v) => setColors(v),
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
        </SizeContext.Provider>
      </ColorContext.Provider>
    </FontSizeContext.Provider>
  );
});

export default process.env.NODE_ENV === 'development' ? hot(module)(View) : View;
