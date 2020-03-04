import { useCallback } from 'react';

const useDownload = () => {
  const download = useCallback(({
    data,
    name,
    mime,
  }) => {
    const blob = new Blob([data], { type: mime });
    const objectURL = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = name;
    a.setAttribute('href', objectURL);
    a.click();
    a.setAttribute('href', null);
    a.remove();
    window.URL.revokeObjectURL(objectURL);
  }, []);

  return download;
};

export default useDownload;
