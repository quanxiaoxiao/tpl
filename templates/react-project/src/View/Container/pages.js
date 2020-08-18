export default [
  {
    name: '上传',
    path: '/uploading',
    iconCode: 'e600',
    component: require('Uploading').default,
  },
  {
    name: '列表',
    path: '/resources',
    iconCode: 'e60b',
    component: require('Resources').default,
  },
];
