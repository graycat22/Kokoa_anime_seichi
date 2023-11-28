"use client";

import React, { useState } from "react";
import { animeData } from "./library/anime-data";
import { useRouter } from "next/navigation";
import { areas } from "./library/area";

const App = () => {
  interface Station {
    stationCode: number;
    stationName: string;
    prefecture: string;
  }
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState(""); // 聖地のエリア
  const [selectedWork, setSelectedWork] = useState(""); // 選択された作品
  const [stationData, setStationData] = useState<Station | null>(null); // 最寄り駅
  const [predStations, setPredStations] = useState<Station[]>([]); // 駅の予測
  const [selectedPref, setSelectedPref] = useState<string>(""); // API 代入用
  const [inputValue, setInputValue] = useState<string>(""); // ユーザの最寄り駅インプット
  const [animeTitles, setAnimeTitles] = useState<string[]>([]); // 選択した都道府県に存在するアニメの聖地

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

  // 駅の予測
  const handleChangeStation = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userInput = e.target.value;
    setStationData(null);
    setInputValue(userInput);
    const filteredInput =
      userInput
        .match(/[ぁ-んァ-ン一-龠]/g)
        ?.filter((char: any) => !/^[a-zA-Zａ-ｚＡ-Ｚ]+$/.test(char))
        .join("") || "";
    const hasAlphabets = /[a-zA-Zａ-ｚＡ-Ｚ]/.test(userInput);
    const finalInput = hasAlphabets ? "" : filteredInput; // HTTP リクエスト数を削減するため
    console.log("userInput", userInput, finalInput, "↓↓↓結果↓↓↓");
    if (finalInput) {
      const railsURL = `https://api.ekispert.jp/v1/json/station/light?key=LE_UtqeL8hrwxSTW&name=${finalInput}`;
      const res = await fetch(railsURL);
      const data = await res.json();
      let station_Data = data.ResultSet.Point;
      console.log("APIレスポンス", station_Data);

      if (!station_Data) {
        return;
      }
      if (!Array.isArray(station_Data)) {
        station_Data = [station_Data];
      }
      const station_data = station_Data.map((item: any) => ({
        stationCode: item.Station.code,
        stationName: item.Station.Name,
        prefecture: item.Prefecture.Name,
      }));
      console.log("整形したcodeとname", station_data);
      setPredStations(station_data);
    }
    console.log("↑↑↑↑↑↑↑↑↑↑↑↑結果↑↑↑↑↑↑↑↑↑↑↑↑");
  };

  // ユーザーを予測クリックしたとき
  const handleClickPredSta = (stationData: Station) => {
    // 最寄り駅の設定
    setStationData(stationData);
    setInputValue(stationData.stationName);
  };

  console.log("stationData", stationData);

  const handlePressX = () => {
    setInputValue("");
    setStationData(null);
  };

  const handleClearInfo = () => {
    setSelectedArea("");
    setSelectedWork("");
    setStationData(null);
    setPredStations([]);
    setAnimeTitles([]);
  };

  // 検索しルート取得。CORS 回避のため、プロキシサーバー経由で外部 API にリクエスト
  const handleSearchRoute = async () => {
    try {
      if (!selectedArea || !selectedWork || !stationData) {
        // トースト通知
        alert("おい");
        return;
      }
      const stationCode = stationData.stationCode;
      router.push(
        `/result?pref=${encodeURIComponent(selectedPref)}&code=${stationCode}`
      );
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
    <div className="App min-h-screen bg-violet-200 px-5">
      <div className="flex justify-center items-center">
        <h1 className="leading-loose tracking-wider py-10 text-xl antialiased">
          聖地行き方検索ツール
        </h1>
      </div>
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
            className="block w-full rounded-xl border-0 h-12 mb-3 py-1.5 pl-9 pr-20 text-gray-800 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6 outline-none"
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
        <div className="relative mt-2 rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm pl-1">:::</span>
          </div>
          <select
            id="work"
            name="work"
            value={selectedWork}
            onChange={handleChangeWork}
            className="block w-full rounded-xl border-0 h-12 mb-3 py-1.5 pl-9 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6 outline-none"
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
            className="block w-full rounded-xl border-0 h-12 mb-1 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 place-holder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm sm:leading-6 outline-none"
            required
            value={inputValue}
            onChange={handleChangeStation}
          />
          <ul
            className={`${
              inputValue === "" || stationData !== null ? "hidden" : "block"
            } absolute z-10 bg-white shadow-md overflow-y-auto h-96 w-full rounded-3xl`}
          >
            {predStations.map((item: Station, index: number) => (
              <li
                key={index}
                className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 py-2 px-4"
                onClick={() => handleClickPredSta(item)}
              >
                <p className="text-gray-900">
                  駅名: {item.stationName}（{item.prefecture}）
                </p>
              </li>
            ))}
          </ul>
          <button
            className="absolute inset-y-1.5 right-2 top-3 flex text-gray-400 hover:text-violet-500 focus:text-violet-760 button-container"
            onClick={handlePressX}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.4"
              stroke="currentColor"
              className="w-6 h-6 svg-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="miter"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex mt-5 h-10">
        <button
          className="bg-gray-400 font-semibold text-white rounded-md mx-1"
          style={{ flex: "1" }}
          onClick={handleClearInfo}
        >
          クリア
        </button>
        <button
          className="bg-violet-500 font-semibold text-white rounded-md mx-1"
          style={{ flex: "4" }}
          onClick={handleSearchRoute}
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default App;
