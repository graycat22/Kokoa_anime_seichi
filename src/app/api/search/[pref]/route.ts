import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const query: String = req.url.split("/search/")[1];
  const { lat, lng } = await getGeocodingData(query);
  const stations = await getHeartExpressData(lat, lng);
  return NextResponse.json(stations);
};

// Geocoding で聖地の緯度経度を分析
async function getGeocodingData(query: String) {
  try {
    const res = await fetch(`https://www.geocoding.jp/api/?q=${query}`, {
      cache: "no-store",
    });
    const xmlText = await res.text(); // XML を文字列化

    // const convert = require("xml-js"); // 以下別解
    // const json = convert.xml2json(xmlText, { compact: true, spaces: 2 });
    // console.log(xmlText, json);
    // const lat = json.result.address._text;
    // const lng = json.result.coordinate.lng._text;

    // テキストに変換した XML から緯度を抽出
    const startIndex = xmlText.indexOf("<lat>") + "<lat>".length;
    const endIndex = xmlText.indexOf("</lat>");
    const lat: number = parseFloat(xmlText.substring(startIndex, endIndex));

    // テキストに変換した XML から経度を抽出
    const startIndex_ = xmlText.indexOf("<lng>") + "<lng>".length;
    const endIndex_ = xmlText.indexOf("</lng>");
    const lng: number = parseFloat(xmlText.substring(startIndex_, endIndex_));
    console.log(lat, lng, ": lat, lgn");
    return { lat, lng };
  } catch (error) {
    console.error("Geocoding APIでエラーが発生しました:", error);
    throw new Error("位置情報の取得中にエラーが発生しました");
  }
}

async function getHeartExpressData(lat: number, lng: number) {
  try {
    const heartExpressURL = `https://express.heartrails.com/api/json?method=getStations&x=${lng}&y=${lat}`;
    const res = await fetch(heartExpressURL, { cache: "no-store" });
    const data = await res.json();
    console.log(heartExpressURL, data, "url, data"); ///
    const stationsData = data.response.station;
    return stationsData;
  } catch (error) {
    console.error("HeartRails APIでエラーが発生しました:", error);
    throw new Error("位置情報の取得中にエラーが発生しました");
  }
}
