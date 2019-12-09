import { useContext } from 'react';
import FontSizeContext from 'contexts/FontSize';

const useFontSize = () => {
  const fontSize = useContext(FontSizeContext);

  return fontSize;
};


export default useFontSize;
