import _ from 'lodash';

export const initialState = {
  navList: [
    {
      name: 'project',
      path: '/project',
    },
  ],
  loadingShow: false,
  toastrList: [],
};

export const actions = {
  showLoading: () => ({
    type: 'showLoading',
  }),
  hideLoading: () => ({
    type: 'hideLoading',
  }),
  addToastr: (payload) => ({
    type: 'addToastr',
    payload,
  }),
  removeToastr: (payload) => ({
    type: 'removeToastr',
    payload,
  }),
};

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'showLoading':
      return {
        ...state,
        loadingShow: true,
      };
    case 'hideLoading':
      return {
        ...state,
        loadingShow: false,
      };
    case 'addToastr':
      return {
        ...state,
        toastrList: [...state.toastrList, { ...payload, id: _.uniqueId('toastr_') }],
      };
    case 'removeToastr':
      return {
        ...state,
        toastrList: state.toastrList.filter((item) => item.id !== payload),
      };
    default:
      throw new Error();
  }
};
