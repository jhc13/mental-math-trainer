import {
  Chart,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(TimeScale, LinearScale, PointElement, LineElement, zoomPlugin);

export default function RecordProgressionsChart({ progressions }) {
  const data = {
    datasets: progressions.map((progression) => ({
      data: progression.records
    }))
  };
  const options = {
    scales: {
      x: {
        type: 'time'
      }
    },
    parsing: {
      xAxisKey: 'timestamp',
      yAxisKey: 'centiseconds'
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true
        },
        zoom: {
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          }
        }
      }
    }
  };
  return <Line type='line' data={data} options={options} />;
}
