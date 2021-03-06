import {
  Chart,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  capitalize,
  formatCentiseconds,
  formatRecordFormat
} from 'utils/format';

Chart.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  zoomPlugin
);

const markerColors = [
  '#dc2626', // Red
  '#f97316', // Orange
  '#facc15', // Yellow
  '#16a34a', // Green
  '#0ea5e9', // Sky blue
  '#1d4ed8', // Blue
  '#7e22ce' // Purple
];

const lineColors = [
  '#f87171', // Red
  '#fdba74', // Orange
  '#fef08a', // Yellow
  '#4ade80', // Green
  '#7dd3fc', // Sky blue
  '#3b82f6', // Blue
  '#a855f7' // Purple
];

export default function RecordProgressionsChart({ progressions }) {
  const minTimestamp = Math.min(
    ...progressions.map((progression) =>
      Math.min(
        ...progression.records.map((record) => Date.parse(record.timestamp))
      )
    )
  );
  const maxTimestamp = Math.max(
    ...progressions.map((progression) =>
      Math.max(
        ...progression.records.map((record) => Date.parse(record.timestamp))
      )
    )
  );

  const data = {
    datasets: progressions.map((progression, i) => ({
      label: capitalize(
        formatRecordFormat(
          progression.calculationMethod,
          progression.problemCount,
          true
        )
      ),
      data: progression.records,
      order: -i,
      stepped: true,
      pointBackgroundColor: markerColors[i],
      pointBorderColor: markerColors[i],
      pointRadius: 4,
      pointHitRadius: 32,
      borderColor: lineColors[i]
    }))
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
      xAxisKey: 'timestamp',
      yAxisKey: 'centiseconds'
    },
    scales: {
      x: {
        type: 'time',
        min: minTimestamp - (maxTimestamp - minTimestamp) * 0.05,
        max: maxTimestamp + (maxTimestamp - minTimestamp) * 0.05,
        time: {
          minUnit: 'day',
          tooltipFormat: 'MMM d, yyyy, HH:mm'
        },
        grid: {
          borderColor: '#f4f4f5',
          color: '#3f3f46',
          tickColor: '#f4f4f5'
        },
        ticks: {
          color: '#f4f4f5',
          font: {
            family: 'Inter, sans-serif',
            size: 16
          }
        }
      },
      y: {
        grace: '5%',
        grid: {
          borderColor: '#f4f4f5',
          color: '#3f3f46',
          tickColor: '#f4f4f5'
        },
        ticks: {
          callback: (centiseconds) =>
            formatCentiseconds(Math.round(centiseconds)),
          color: '#f4f4f5',
          font: {
            family: 'Inter, sans-serif',
            size: 16
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          color: '#f4f4f5',
          font: {
            family: 'Inter, sans-serif',
            size: 16
          },
          padding: 16
        },
        reverse: true
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${formatCentiseconds(context.parsed.y)} ${context.dataset.label}`
        },
        padding: 8,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 4,
        usePointStyle: true,
        titleColor: '#f4f4f5',
        titleFont: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'normal'
        },
        bodySpacing: 4,
        bodyColor: '#f4f4f5',
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 16
        }
      },
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
        },
        limits: {
          x: {
            min: 'original',
            max: Date.now() + (Date.now() - minTimestamp) * 0.05
          },
          y: {
            min: 0,
            max: 'original'
          }
        }
      }
    }
  };
  return (
    <div className='mb-5 h-96 sm:mb-8'>
      <div className='select-none text-center text-xl font-medium'>
        Record progressions
      </div>
      <Line type='line' data={data} options={options} />
    </div>
  );
}
