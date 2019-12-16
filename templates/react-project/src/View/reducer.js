export const initialState = {
  navList: [
    {
      name: 'project',
      path: '/project',
    },
  ],
  loadingShow: false,
};

export const actions = {
  showLoading: () => ({
    type: 'showLoading',
  }),
  hideLoading: () => ({
    type: 'hideLoading',
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
    default:
      throw new Error();
  }
};
