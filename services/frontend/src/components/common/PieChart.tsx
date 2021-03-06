import * as React from 'react'
import { Chart } from 'react-google-charts'

interface Props {
    categories: Category[]
}

interface Category {
    name: string
    value: number
}

const PieChart: React.FC<Props> = (props: Props) => {
    const lineChartData = props.categories.map((x) => [x.name, x.value])

    return (
        <Chart
            chartType="PieChart"
            data={[['x', 'y'], ...lineChartData]}
            options={{
                fontName: 'Raleway',
                legend: {
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                    },
                },
                chartArea: {
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    height: '80%',
                },
            }}
            width="100%"
            height="400px"
        />
    )
}

export default PieChart
