'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { quotes } from '@/app/lib/quotes';

interface WaterData {
  MSR_DATE: string;
  MSR_TIME: string;
  SITE_ID: string;
  W_TEMP: string;
}

export default function Home() {
  const [noryangjinTemp, setNoryangjinTemp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

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

      <div className='relative z-10 bg-white p-6 m-3 rounded-lg shadow-lg text-center'>
        <h1 className='text-2xl font-bold mb-4'>한강 수온</h1>
        {error ? (
          <p className='text-red-500'>{error}</p>
        ) : noryangjinTemp ? (
          <>
            <p className='text-xl'>
              현재 수온: <span className='font-bold'>{noryangjinTemp}°C</span>
            </p>

            <p>
              {+noryangjinTemp > 30
                ? '따뜻해요, 발만 담그세요.'
                : '차가워요, 들어가지 마세요'}
            </p>

            {/* Investment Quote Section */}
            <div className='mt-8 p-4 bg-gray-100 rounded-lg shadow-md'>
              <p className='text-lg italic text-gray-700'>
                {randomQuote.korean}
              </p>
              <p className='text-sm italic text-gray-500 mt-1'>
                {randomQuote.english}
              </p>
              <p className='text-sm font-semibold text-gray-600 mt-3 text-right'>
                - {randomQuote.author}
              </p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
