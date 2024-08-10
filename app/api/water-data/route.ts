import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await axios.get(
      'http://openapi.seoul.go.kr:8088/4b7a545473736f6c35307244427141/json/WPOSInformationTime/1/5/'
    );
    const data = response.data.WPOSInformationTime.row;
    const noryangjinData = data.find((site: any) => site.SITE_ID === '노량진');
    // res.status(200).json(noryangjinData ? noryangjinData.W_TEMP : null);
    return NextResponse.json(noryangjinData ? noryangjinData.W_TEMP : null);
  } catch (error) {
    console.error('Error fetching data', error);
    // res.status(500).json(null);
    return NextResponse.json(null);
  }
}
