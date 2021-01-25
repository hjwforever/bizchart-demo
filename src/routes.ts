import BasicLayout from '@/layouts/BasicLayout';
import Demo1 from '@/pages/BizChart/demo1';
import Demo2 from '@/pages/BizChart/demo2';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/',
        exact: true,
        component: Demo1,
      },
      {
        path: '/demo1',
        exact: true,
        component: Demo1,
      },
      {
        path: '/demo2',
        exact: true,
        component: Demo2,
      },
    ],
  },
];
export default routerConfig;
