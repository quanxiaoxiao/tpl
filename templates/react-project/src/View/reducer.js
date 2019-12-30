import _ from 'lodash';
import createReducer from 'utils/createReducer';

export const initialState = {
  loadingShow: false,
  toastrList: [],
};

const { actions, reducer } = createReducer({
  showLoading: (state) => ({
    ...state,
    loadingShow: true,
  }),
  hideLoading: (state) => ({
    ...state,
    loadingShow: false,
  }),
  addToastr: (state, payload) => ({
    ...state,
    toastrList: [...state.toastrList, { ...payload, id: _.uniqueId('toastr_') }],
  }),
  removeToastr: (state, payload) => ({
    ...state,
    toastrList: state.toastrList.filter((item) => item.id !== payload),
  }),
});


export { actions, reducer };
