import { Chart } from '@antv/g2';
import classNames from 'classnames';
import React, { useEffect } from 'react';


const G2Chart  = ({
  prefixCls = 'g2chart',
  className,
  style,
  chartRef,
  spec,
  ...restProps
}) => {
  const compClassName = classNames(`${prefixCls}`, className);

  const height = style?.height || 240;
  const width = style?.width || '100%';

  useEffect(() => {
    if (chartRef?.current && spec) {
      const chart = new Chart({
        theme: 'classic',
        container: chartRef.current,
        autoFit: true,
        height: 240,
      });
      chart.options(spec);
      chart.render();
    }
  }, [spec]);

  return (
    <div
      {...restProps}
      className={compClassName}
      ref={chartRef}
      style={{ width, height, margin: 'auto' }}
    />
  );
};

export default G2Chart;