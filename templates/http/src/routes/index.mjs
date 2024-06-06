export default {
  '/test': {
    get: (ctx) => {
      ctx.response = {
        data: {
          name: 'ok',
        },
      };
    },
  },
};
