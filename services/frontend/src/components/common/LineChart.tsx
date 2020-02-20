import { Chart } from 'react-google-charts';
import * as React from 'react';

interface IProps {
	data: TimeValue[];
	xAxis: string;
	yAxis: string;
}

interface TimeValue {
	date: Date;
	value: number;
}

const LineChart = (props: IProps) => {
	const lineChartData = props.data.map(x => [x.date, x.value]);

	return (
		<Chart chartType="LineChart"
			data={[
			   ['x', 'y'],
			   ...lineChartData
			]}
			width="100%"
			height='400px'
			options={{
				backgroundColor: 'transparent',
				hAxis: {
					title: props.xAxis,
				},
				vAxis: {
					title: props.yAxis,
					viewWindow: { min: 0, max: 10 }
				},
				legend: 'none'
			}}/>
	)
};

export default LineChart;
