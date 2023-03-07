import createReducer from '@quan/utils/createReducer';
import { convertStateToActions } from '@quan/utils';

export const initialState = {
  params: {
    keywords: '',
  },
};

const { actions, reducer } = createReducer(convertStateToActions(initialState));

export { actions, reducer };
