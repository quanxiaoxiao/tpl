import { useEffect, useRef } from 'react';

const useResource = (type = 'text') => {
  const inputSaved = useRef();
  const resultSaved = useRef();

  const handleChange = (ev) => {
    const { files } = ev.target;
    const [file] = Array.from(files);
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      const data = {
        result,
        name: file.name,
        mime: file.type,
        size: result.byteLength,
      };
      if (resultSaved.current) {
        resultSaved.current(data);
      }
    };
    if (type === 'text') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    inputSaved.current = input;
    input.addEventListener('change', handleChange);
    return () => {
      resultSaved.current = null;
      input.removeEventListener('change', handleChange);
    };
  }, []);

  const getResource = async (accept) => {
    if (inputSaved.current) {
      const input = inputSaved.current;
      if (accept) {
        input.setAttribute('accept', accept);
      } else {
        input.removeAttribute('accept');
      }
      input.value = null;
      input.click();
      const ret = await new Promise((resolve) => {
        resultSaved.current = (result) => {
          resultSaved.current = null;
          resolve(result);
        };
      });
      return ret;
    }
    return null;
  };

  return getResource;
};


export default useResource;
