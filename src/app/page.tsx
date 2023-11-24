"use client";

import { useState } from "react";
import { animeData } from "./library/anime-data";
import { jrStations } from "./library/stations-jr";

const App = () => {
  const [selectedArea, setSelectedArea] = useState(""); // 聖地のエリア
  const [selectedWork, setSelectedWork] = useState(""); // 選択された作品
  const [selectedStation, setSelectedStation] = useState(null); // 最寄り駅
  const [predStations, setPredStations] = useState<string[]>([]);
  const [selectedPref, setSelectedPref] = useState<string>("");

  // const [titles, setTitles] = useState([]); // スクレイプしたアニメタイトルを格納
  // const [prefectures, setPrefectures] = useState([]); // スクレイプした都道府県を格納

  const [animeTitles, setAnimeTitles] = useState<string[]>([]); // 選択した都道府県に存在するアニメの聖地
  const [geo, setGeo] = useState<number[]>([]); // 外部 API から地理データを格納

  // ここでスクレイピングする。
  // わざわざファイル分割しても醜くなるだけ。
  // const handleFetchData = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3300`);
  //     const data = await response.json();

  //     console.log(data);

  //     // アニメタイトルのみの配列を取得
  //     const titles = data.formattedData.map(
  //       (anime: { title: any }) => anime.title
  //     );
  //     //アニメの聖地のある都道府県の配列を取得
  //     const prefectures = data.formattedData.map(
  //       (anime: { prefecture: any }) => anime.prefecture
  //     );

  //     setTitles(titles);
  //     setPrefectures(prefectures);
  //   } catch (error) {
  //     console.error("エラーが発生しました:", error);
  //   }
  // };

  ////

  const areas = [
    {
      group: "北海道・東北",
      prefectures: [
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
      ],
    },
    {
      group: "関東",
      prefectures: [
        "東京都",
        "神奈川県",
        "埼玉県",
        "千葉県",
        "茨城県",
        "栃木県",
        "群馬県",
      ],
    },
    {
      group: "中部",
      prefectures: ["愛知県", "岐阜県", "静岡県", "三重県", "長野県"],
    },
    {
      group: "近畿",
      prefectures: [
        "大阪府",
        "兵庫県",
        "京都府",
        "滋賀県",
        "奈良県",
        "和歌山県",
      ],
    },
    {
      group: "中国",
      prefectures: ["広島県", "岡山県", "鳥取県", "島根県", "山口県"],
    },
    { group: "四国", prefectures: ["香川県", "徳島県", "愛媛県", "高知県"] },
    {
      group: "九州・沖縄",
      prefectures: [
        "福岡県",
        "佐賀県",
        "長崎県",
        "大分県",
        "熊本県",
        "宮崎県",
        "鹿児島県",
        "沖縄県",
      ],
    },
  ];

  ////// 駅検索メソッド

  // それぞれエリア・作品・最寄り駅が変更された際に、seleced●●●●に再代入されるハンドル
  const handleChangeArea = (e: { target: any }) => {
    const selectedArea = e.target.value;
    setSelectedArea(selectedArea);
    setSelectedWork(""); // 2つ目のドロップダウンリストをリセット

    // 選択したエリアに存在する作品を抽出
    const filteredTitles = animeData
      .filter((anime) => anime.prefecture.includes(selectedArea))
      .map((anime) => anime.title);
    setAnimeTitles(filteredTitles);
    console.log(filteredTitles, "filteredTitles");
  };

  // 作品選択時にその作品聖地の都道府県をセット
  const handleChangeWork = (e: { target: any }) => {
    const selectedWork = e.target.value;
    setSelectedWork(selectedWork);

    const pref = animeData.find(
      (anime) => anime.title === selectedWork
    )?.prefecture;
    setSelectedPref(pref!);
  };

  const handleChangeStation = (e: { target: any }) => {
    const selectedStation = e.target.value || null;
    setSelectedStation(selectedStation);

    // 駅の予測
    const predictedStations = jrStations
      .filter(
        (station) =>
          station.kana.startsWith(selectedStation) ||
          station.name.startsWith(selectedStation)
      )
      .map((item) => item.name);
    setPredStations(predictedStations);
  };

  const handleClearInfo = () => {
    setSelectedArea("");
    setSelectedWork("");
    setSelectedStation(null);
    setPredStations([]);
    setAnimeTitles([]);
  };

  // 緯度経度を取得。CORS 回避のため、プロキシサーバー経由で外部 API にリクエスト
  const handleGeocoding = async () => {
    try {
      if (!selectedArea) {
        // トースト通知
        alert("おい");
        return;
      }
      const res = await fetch(
        `http://localhost:3000/api/search/${encodeURIComponent(selectedPref)}`,
        { cache: "no-store" }
      ); // ダイナミックルーティングを使用
      console.log(res);
      const stations = await res.json();

      // // const convert = require("xml-js");
      // // const json = convert.xml2json(xmlText, { compact: true, spaces: 2 });
      // // console.log(xmlText, json);
      // // const lat = json.result.address._text;
      // // const lng = json.result.coordinate.lng._text;

      console.log(stations);
      setGeo(stations);
    } catch (error) {
      console.log(error);
    }
  };

  // 以下は旧式の書き方。上の方が直感的で分かりやすい。
  // const handleGeocoding = () => {
  //   fetch(`http://localhost:3000/api/search`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setGeo(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   console.log(geo);
  // };

  return (
    <div className="App min-h-screen bg-gray-300">
      <h1>聖地行き方検索ツール</h1>
      <div id="areas">
        <label
          htmlFor="area"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          エリア選択
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm pl-1">∴</span>
          </div>
          <select
            name="area"
            value={selectedArea}
            onChange={handleChangeArea}
            className="block w-full rounded-md border-0 mb-3 py-1.5 pl-9 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6 outline-none"
          >
            <option value="" disabled>
              地域を選択
            </option>
            {areas.map((areaGroup, index) => (
              <optgroup label={areaGroup.group} key={index}>
                {areaGroup.prefectures.map((prefecture, index) => (
                  <option value={prefecture} key={index}>
                    {prefecture}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      <div id="works">
        <label
          htmlFor="work"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          作品選択
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm pl-1">:::</span>
          </div>
          <select
            id="work"
            name="work"
            value={selectedWork}
            onChange={handleChangeWork}
            className="block w-full rounded-md border-0 mb-3 py-1.5 pl-9 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6 outline-none"
          >
            <option value="" disabled>
              作品を選択
            </option>
            {animeTitles.map((animeTitle, index) => (
              <option key={index}>{animeTitle}</option>
            ))}
          </select>
        </div>
      </div>
      <div id="station">
        <label
          htmlFor="station"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          出発駅を指定
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">Go</span>
          </div>
          <input
            type="text"
            placeholder="最寄り駅を入力"
            className="block w-full rounded-md border-0 mb-3 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 place-holder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6 outline-none"
            required
            value={selectedStation || ""}
            onChange={handleChangeStation}
          />
          <div className="absolute inset-y-0 right-0 flex items-center"></div>
        </div>
        <div>
          {predStations.map((station, index) => (
            <div key={index}>{station}</div>
          ))}
        </div>
        <div className="flex h-10">
          <button
            className="bg-gray-400 font-semibold text-white rounded-md mx-1"
            style={{ flex: "1" }}
            onClick={handleClearInfo}
          >
            クリア
          </button>
          <button
            className="bg-violet-500	 font-semibold text-white rounded-md mx-1"
            style={{ flex: "4" }}
            onClick={handleGeocoding}
          >
            検索
          </button>
        </div>
      </div>
      <button className="bg-gray-500 text-white mx-3 my-5 w-full">
        押してね
      </button>
      {selectedArea ? `${geo[0]} ::: ${geo[1]}` : null}
      {/* <ul>
        {titles.map((title, index) => (
          <li key={index}>{`${index + 1}: ${title} -------------- ${
            prefectures[index]
          }`}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default App;
