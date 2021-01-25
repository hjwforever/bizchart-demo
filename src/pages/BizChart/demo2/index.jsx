import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@alifd/next';
import { Link } from 'ice';
import { Chart, Line, Axis, Tooltip, Annotation, registerAnimation } from 'bizcharts';
import moment from 'moment';

import styles from './index.module.scss';

function getDivideRate(data, field, divideValue) {
  const values = data.reduce((pre, item) => {
    if (item[field]) {
      pre.push(item[field]);
    }
    return pre;
  }, []);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  return ((maxValue - divideValue) / (maxValue - minValue)).toFixed(4) || 0;
}

function custUpdate(shape, animateCfg, cfg) {
  const { toAttrs } = cfg;
  const { path } = toAttrs;
  if (path.length < 3) {
    shape.animate({
      ...toAttrs,
    });
    return;
  }
  const dx = path[1][1] - path[0][1];
  shape.attr({
    ...toAttrs,
    path: [...path.slice(0, path.length - 1)],
  });
  shape.translate(dx);
  shape.animate({
    ...toAttrs,
  }, animateCfg);
}


registerAnimation('cust-animation', custUpdate);


// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
class LineChart extends React.Component {
  scale = {
    date: {
      alias: '日期',
      type: 'time',
      formatter: (d) => moment(d).format('mm:ss'),
    },
    count: {
      alias: '次数',
      min: 0,
      max: 52,
      sync: 'pre_count',
    },
    pre_count: {
      alias: '次数',
      min: 0,
      max: 52,
      sync: true,
    },
  };
  render() {
    const { data } = this.props;
    const { scale } = this;

    const warningValue = 28;
    const divideRate = getDivideRate(data, 'count', warningValue);
    const preDivideRate = getDivideRate(data, 'pre_count', warningValue);
    const colors = ['#FF8060', '#6BA8FF'];


    return (
      <Chart height={400} animate={false} autoFit data={data} appendPadding={20} scale={scale}>
        <Tooltip showCrosshairs />
        <Axis name="count" />
        <Line
          position="date*count"
          color={`l(90) 0:${colors[0]} ${divideRate}:${colors[0]} ${divideRate}:${colors[1]} 1:${colors[1]}`}
        />
        <Line
          style={{
            lineDash: [2, 4],
          }}
          position="date*pre_count"
          color={`l(90) 0:${colors[0]} ${preDivideRate}:${colors[0]} ${preDivideRate}:${colors[1]} 1:${colors[1]}`}
        />
        <Annotation.Line
          start={['min', warningValue]}
          end={['max', warningValue]}
          text={{
            position: 'end',
            content: `警戒线 ${warningValue}`,
            offsetX: -30,
            offsetY: -5,
            style: {
              fill: colors[0],
            },
          }}
          style={{
            lineDash: [4, 2],
            stroke: colors[0],
          }}
        />
      </Chart>
    );
  }
}


const Demo2 = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const count = 10 + Math.round(Math.random() * 30);
      const newData = {
        date: new Date().getTime(),
        count: null,
        pre_count: count,
      };
      if (dataSource[dataSource.length - 3]) {
        const lastItems = dataSource.slice(0, dataSource.length - 2);
        lastItems.forEach((it) => {
          it.count = it.pre_count;
        });
      }
      if (dataSource.length < 20) {
        setDataSource([...dataSource, newData]);
      } else {
        setDataSource([
          ...dataSource.slice(1, 20),
          newData,
        ]);
      }
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>BizChart-demo1</h2>

      <Link to={'/demo1'}>
        <Button type="primary" size="large">
          去Demo1
        </Button>
      </Link>
      <LineChart data={dataSource} />
    </div>
  );
};

export default Demo2;
