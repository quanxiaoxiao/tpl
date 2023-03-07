import { useContext } from 'react';
import Context from './Context';

const useStore = () => useContext(Context);

export default useStore;
