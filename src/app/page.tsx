"use client";

import { useState } from "react";

const App = () => {
  const [showAreaPopup, setShowAreaPopup] = useState(false); // 聖地エリア選択画面
  const [showWorkPopup, setShowWorkPopup] = useState(false); // 作品選択画面
  const [showStationPopup, setShowStationPopup] = useState(false); // 出発駅選択画面

  const [selectedArea, setSelectedArea] = useState(""); // 聖地のエリア
  const [selectedWork, setSelectedWork] = useState(""); // 選択された作品
  const [selectedStation, setSelectedStation] = useState(""); // 最寄り駅

  const [titles, setTitles] = useState([]); // スクレイプしたアニメタイトルを格納
  const [prefectures, setPrefectures] = useState([]); // スクレイプした都道府県を格納
  const [query, setQuery] = useState("");
  const [geo, setGeo] = useState<number[]>([]); // 外部 API から地理データを格納

  // ここでスクレイピングする。わざわざファイル分割しても醜くなるだけ。
  const handleFetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3300`);
      const data = await response.json();

      console.log(data);

      // アニメタイトルのみの配列を取得
      const titles = data.formattedData.map(
        (anime: { title: any }) => anime.title
      );
      //アニメの聖地のある都道府県の配列を取得
      const prefectures = data.formattedData.map(
        (anime: { prefecture: any }) => anime.prefecture
      );

      setTitles(titles);
      setPrefectures(prefectures);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

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

  // それぞれエリア・作品・最寄り駅が変更された際に、seleced●●●●に再代入されるハンドル
  const handleChangeArea = (e: { target: any }) => {
    setSelectedArea(e.target.value);
  };
  const handleChangeWork = (e: { target: any }) => {
    setSelectedWork(e.target.value);
  };
  const handleChangeStation = (e: { target: any }) => {
    setSelectedStation(e.target.value);
  };

  // 緯度経度を取得
  const handleGeocoding = async () => {
    try {
      if (!selectedArea) {
        // トースト通知
        return;
      }
      const res = await fetch(
        `http://localhost:3000/api/search/${selectedArea}`,
        { cache: "no-store" }
      ); // ダイナミックルーティングを使用
      const xmlText = await res.text();

      // テキストに変換した XML から緯度を抽出
      const startIndex = xmlText.indexOf("<lat>") + "<lat>".length;
      const endIndex = xmlText.indexOf("</lat>");
      const lat: number = parseFloat(xmlText.substring(startIndex, endIndex));

      // テキストに変換した XML から経度を抽出
      const startIndex_ = xmlText.indexOf("<lng>") + "<lng>".length;
      const endIndex_ = xmlText.indexOf("</lng>");
      const lng: number = parseFloat(xmlText.substring(startIndex_, endIndex_));

      const latLng: number[] = [lat, lng];
      console.log(latLng);
      setGeo(latLng);
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
            id="area"
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
                {areaGroup.prefectures.map((prefecture) => (
                  <option value={prefecture} key={prefecture}>
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
            onChange={handleChangeStation}
          />
          <div className="absolute inset-y-0 right-0 flex items-center"></div>
        </div>
        <div className="flex h-10">
          <button
            className="bg-gray-400 font-semibold text-white rounded-md mx-1"
            style={{ flex: "1" }}
          >
            クリア
          </button>
          <button
            className="bg-violet-500	 font-semibold text-white rounded-md mx-1"
            style={{ flex: "4" }}
          >
            検索
          </button>
          <button className="bg-red-400" onClick={handleGeocoding}>
            入力
          </button>
        </div>
      </div>
      <button
        className="bg-gray-500 text-white mx-3 my-5 w-full"
        onClick={handleFetchData}
      >
        押してね
      </button>
      {geo[0]} ::: {geo[1]}
      <ul>
        {titles.map((title, index) => (
          <li key={index}>{`${index + 1}: ${title} -------------- ${
            prefectures[index]
          }`}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
