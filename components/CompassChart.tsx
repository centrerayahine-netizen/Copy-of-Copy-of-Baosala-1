import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartData } from '../types';
import { Theme } from '../themes';

interface CompassChartProps {
  data: ChartData[];
  theme: Theme;
}

const wordWrap = (str: string, maxChars: number): string[] => {
    const words = str.split(' ');
    if (words.length === 1 && str.length > maxChars) {
      // Handle very long single words by breaking them
      const chunks = [];
      for (let i = 0; i < str.length; i += maxChars) {
        chunks.push(str.substring(i, i + maxChars));
      }
      return chunks;
    }

    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length > maxChars) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine = (currentLine + ' ' + word).trim();
        }
    });
    if (currentLine) {
        lines.push(currentLine.trim());
    }
    return lines;
};

const CustomizedAxisTick = (props: any) => {
  const { x, y, payload, angle } = props;
  const maxCharsPerLine = 15;
  const lines = wordWrap(payload.value, maxCharsPerLine);
  
  let textAnchor;
  if (angle === 90 || angle === 270) {
    textAnchor = 'middle';
  } else if (angle >= 0 && angle < 90) {
    textAnchor = 'start';
  } else if (angle > 90 && angle < 270) {
    textAnchor = 'end';
  } else { // angle > 270 and < 360
    textAnchor = 'start';
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor={textAnchor}
        fill="#475569"
        fontSize={12}
        fontFamily="Cairo"
      >
        {lines.map((line, index) => (
          <tspan x={0} dy={index === 0 ? 0 : '1.2em'} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};


const CompassChart: React.FC<CompassChartProps> = ({ data, theme }) => {
  const { totalScore, totalPossibleScore } = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalScore: 0, totalPossibleScore: 0 };
    }
    const totalScore = data.reduce((acc, item) => acc + item.score, 0);
    const totalPossibleScore = data.reduce((acc, item) => acc + item.fullMark, 0);
    return { totalScore, totalPossibleScore };
  }, [data]);

  const percentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

  const dynamicTheme = useMemo(() => {
    const roundedPercentage = Math.round(percentage);
    if (roundedPercentage < 50) {
      return { // Red for scores under 50%
        fill: '#f43f5e',
        stroke: '#e11d48',
        textDarker: 'text-rose-800',
      };
    } else if (roundedPercentage < 70) { // Green for scores between 50% and 69%
      return {
        fill: '#10b981',
        stroke: '#059669',
        textDarker: 'text-emerald-800',
      };
    } else { // Blue for scores 70% and above
      return {
        fill: '#06b6d4',
        stroke: '#0891b2',
        textDarker: 'text-cyan-800',
      };
    }
  }, [percentage]);

  // key prop on RadarChart forces a re-render when data changes, fixing some animation bugs
  return (
    <div className="relative w-full h-[400px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-10">
        <span className={`text-6xl font-bold ${dynamicTheme.textDarker}`} style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>
          {Math.round(percentage)}%
        </span>
        <span className="text-md font-semibold text-slate-500 mt-1">الأداء العام</span>
      </div>
      <ResponsiveContainer>
        <RadarChart key={JSON.stringify(data)} cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={<CustomizedAxisTick />}
            />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 10]} 
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Cairo' }} 
            />
          <Radar 
            name="التقييم" 
            dataKey="score" 
            stroke={dynamicTheme.stroke}
            fill={dynamicTheme.fill}
            fillOpacity={0.6} 
            />
          <Tooltip 
            contentStyle={{ fontFamily: 'Cairo', direction: 'rtl' }}
            labelStyle={{ fontWeight: 'bold' }}
           />
           <Legend 
            wrapperStyle={{ fontFamily: 'Cairo' }}
           />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompassChart;