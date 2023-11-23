// import { NextRequest, NextResponse } from "next/server";

// export const GET = async (req: NextRequest, res: NextResponse) => {
//   const query: String = await req.text();
//   const geocodingData = await getGeocodingData(query);
//   return NextResponse.json(geocodingData);
// };

// // Geocoding で聖地の緯度経度を分析
// async function getGeocodingData(query) {
//   try {
//     const res = await fetch(`https://www.geocoding.jp/api/?q=${query}`);
//     const text: string = await res.text();
//     return text;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

// export const getHeartExpressData = async (query: Text) => {
//   const heartExpressURL = `http://express.heartrails.com/api/json?method=getAreas
//   `;
// };
