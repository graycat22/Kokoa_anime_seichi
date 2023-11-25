import { NextRequest, NextResponse } from "next/server";
import { load } from "cheerio";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    // URL `...vercel.app/api/search/目的都道府県&出発駅コード` から目的都道府県と出発駅を抜き出す
    const newUrl = req.url.split("/").pop();
    const [query, userDepStaCode] = newUrl!.split("&");
    // 関数より目的地(都道府県+自治体名)の緯度経度を取得
    const { lat, lng } = await getGeocodingData(query);
    console.log("緯度経度＝＝＞", lat, lng);
    // 緯度経度より目的地の駅を取得
    const destination = await getHeartExpressData(lat, lng);
    console.log("到着駅＝＞", destination.name);
    // 到着駅と出発駅の駅コードを駅名から取得。同名他県の駅を避けるため、駅名と県の情報を一致させる
    const stationCodes = [
      await getStationCode(destination.name, destination.prefecture),
      userDepStaCode,
    ];

    console.log("到着駅の駅コード, 出発駅の駅コード", stationCodes);

    // ルート探索。回答は URL で返されるため、別途スクレイピングする
    const course = await searchRouteByEkispert(
      stationCodes[0],
      stationCodes[1]
    );

    const result = await getRoute(course);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "error", error });
  }
};

// Geocoding で自治体名から聖地の緯度経度を抽出
async function getGeocodingData(query: String) {
  try {
    const res = await fetch(`https://www.geocoding.jp/api/?q=${query}`, {
      cache: "no-store",
    });
    const xmlText = await res.text(); // XML を文字列化

    // テキストに変換した XML から緯度を抽出
    const startIndex = xmlText.indexOf("<lat>") + "<lat>".length;
    const endIndex = xmlText.indexOf("</lat>");
    const lat: number = parseFloat(xmlText.substring(startIndex, endIndex));

    // テキストに変換した XML から経度を抽出
    const startIndex_ = xmlText.indexOf("<lng>") + "<lng>".length;
    const endIndex_ = xmlText.indexOf("</lng>");
    const lng: number = parseFloat(xmlText.substring(startIndex_, endIndex_));
    return { lat, lng };
  } catch (error) {
    console.error("Geocoding APIでエラーが発生しました:", error);
    throw new Error("位置情報の取得中にエラーが発生しました");
  }
}

// HeartExpress から緯度経度で最も近い駅1つ(3つ)を取得
async function getHeartExpressData(lat: number, lng: number) {
  try {
    const heartExpressURL = `https://express.heartrails.com/api/json?method=getStations&x=${lng}&y=${lat}`;
    const res = await fetch(heartExpressURL, { cache: "no-store" });
    const data = await res.json();
    const stationsData = data.response.station[0];
    return stationsData;
  } catch (error) {
    console.error("HeartRails APIでエラーが発生しました:", error);
    throw new Error("位置情報の取得中にエラーが発生しました");
  }
}

// Ekispert で駅名から駅コードを入手
async function getStationCode(stationName: String, prefecture: String) {
  const apiURL = `https://api.ekispert.jp/v1/json/station/light?key=LE_UtqeL8hrwxSTW&name=${stationName}`;
  const res = await fetch(apiURL);
  const data = await res.json();
  let stationData = data.ResultSet.Point;

  console.log("ステーションデータ", stationData); //////
  if (!Array.isArray(stationData)) {
    stationData = [stationData];
  }
  const stationCode = stationData.find((data: any) =>
    data.Prefecture.Name.includes(prefecture)
  ).Station.code;
  return stationCode;
}

// ルート検索関数
async function searchRouteByEkispert(destination: String, departure: String) {
  try {
    const apiURL = `https://api.ekispert.jp/v1/json/search/course/light?key=LE_UtqeL8hrwxSTW&from=${departure}&to=${destination}`;
    const res = await fetch(apiURL);
    const data = await res.json();
    const courseURL = data.ResultSet.ResourceURI;
    console.log("URL", courseURL);
    return courseURL;
  } catch (error) {
    console.error("Ekispert APIでエラーが発生しました:", error);
    throw new Error("ルート検索中にエラーが発生しました");
  }
}

async function getRoute(url: string) {
  const response = await fetch(url);
  const data = await response.text();
  const $ = load(data);
  const results: Object[] = [];

  for (let i = 1; i <= 4; i++) {
    const oddIndexResults: Object[] = [];
    const evenIndexResults: Object[] = [];
    const route = `#route0${i}`;
    const result: Object[] = [];

    $(`${route} table.route_list_table tbody tr`).each((index, element) => {
      const totalRows = $("#route01 table.route_list_table tbody tr").length;
      if (index === 0 || index === totalRows - 1) {
        const times: any = $(element).find("td").eq(0).text().trim();

        const arrivalTimeMatch = times.match(/到着(\d{2}:\d{2})/);
        const arrivalTime = arrivalTimeMatch ? arrivalTimeMatch[1] : "";

        const departureTimeMatch = times.match(/出発(\d{2}:\d{2})/);
        const departureTime = departureTimeMatch ? departureTimeMatch[1] : "";

        const time = { arrivalTime, departureTime };

        const station = $(element)
          .find("td")
          .eq(1)
          .text()
          .trim()
          .split("\n")
          .find((text) => text.trim().length > 0);

        const info = $(element)
          .find("td")
          .eq(2)
          .text()
          .trim()
          .split("\n")
          .find((text) => text.trim().length > 0);

        evenIndexResults.push({ index, time, station, info });
      } else if (index % 2 === 0) {
        // こっちが偶数 index
        const times: any = $(element).find("td").eq(0).text().trim();

        const arrivalTimeMatch = times.match(/到着(\d{2}:\d{2})/);
        const arrivalTime = arrivalTimeMatch ? arrivalTimeMatch[1] : "";

        const departureTimeMatch = times.match(/出発(\d{2}:\d{2})/);
        const departureTime = departureTimeMatch ? departureTimeMatch[1] : "";

        const time = { arrivalTime, departureTime };

        const station = $(element)
          .find("td")
          .eq(2)
          .text()
          .trim()
          .split("\n")
          .find((text) => text.trim().length > 0);
        const info = $(element)
          .find("td")
          .eq(3)
          .text()
          .trim()
          .split("\n")
          .find((text) => text.trim().length > 0);
        evenIndexResults.push({ index, time, station, info });
      } else {
        // 奇数 index
        const time = $(element).find("td").eq(0).text().trim();
        const station = $(element)
          .find("td")
          .eq(1)
          .text()
          .trim()
          .split("\n")
          .find((text) => text.trim().length > 0);
        const info = $(element)
          .find("td")
          .eq(2)
          .text()
          .trim()
          .split("\n")
          .find((text) => text.trim().length > 0);
        oddIndexResults.push({ index, time, station, info });
      }
    });

    for (
      let i = 0;
      i < evenIndexResults.length || i < oddIndexResults.length;
      i++
    ) {
      if (evenIndexResults[i]) {
        result.push(evenIndexResults[i]);
      }
      if (oddIndexResults[i]) {
        result.push(oddIndexResults[i]);
      }
    }
    console.log(`${i}個別リザルト`, result);

    results.push({ [`course${i}`]: result });
  }

  console.log("全体リザルト", results);
  return results;
}
