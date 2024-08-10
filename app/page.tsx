'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface WaterData {
  MSR_DATE: string;
  MSR_TIME: string;
  SITE_ID: string;
  W_TEMP: string;
}

export default function Home() {
  const [noryangjinTemp, setNoryangjinTemp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(
        'http://openapi.seoul.go.kr:8088/4b7a545473736f6c35307244427141/json/WPOSInformationTime/1/5/'
      )
      .then((response) => {
        const data: WaterData[] = response.data.WPOSInformationTime.row;
        const noryangjinData = data.find((site) => site.SITE_ID === '노량진');
        if (noryangjinData) {
          setNoryangjinTemp(noryangjinData.W_TEMP);
        } else {
          setError('한강 수온 데이터가 없습니다. 잠시 후 다시 시도해주세요.');
        }
      })
      .catch((error) => {
        console.error('Error fetching the water data', error);
        setError('Failed to fetch data');
      });
  }, []);

  return (
    <div className='relative flex items-center justify-center h-screen bg-blue-500 overflow-hidden'>
      {/* Waves Background */}
      <div className='absolute top-0 left-0 right-0 bottom-0 z-0'>
        <div className='wave-animation wave1'></div>
        <div className='wave-animation wave2'></div>
      </div>

      <div className='relative z-10 bg-white p-6 rounded-lg shadow-lg text-center'>
        <h1 className='text-2xl font-bold mb-4'>한강 수온</h1>
        {error ? (
          <p className='text-red-500'>{error}</p>
        ) : noryangjinTemp ? (
          <p className='text-xl'>
            현재 수온: <span className='font-bold'>{noryangjinTemp}°C</span>
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
