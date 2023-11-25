"use client";

import { useState } from "react";
import { animeData } from "./library/anime-data";
import { useRouter } from "next/navigation";

const App = () => {
  interface Station {
    stationCode: Number;
    stationName: String;
    prefecture: String;
  }
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState(""); // 聖地のエリア
  const [selectedWork, setSelectedWork] = useState(""); // 選択された作品
  const [stationData, setStationData] = useState<Station | null>(null); // 最寄り駅
  const [predStations, setPredStations] = useState<Station[]>([]); // 駅の予測
  const [selectedPref, setSelectedPref] = useState<string>(""); // API 代入用

  // const [titles, setTitles] = useState([]); // スクレイプしたアニメタイトルを格納
  // const [prefectures, setPrefectures] = useState([]); // スクレイプした都道府県を格納

  const [animeTitles, setAnimeTitles] = useState<string[]>([]); // 選択した都道府県に存在するアニメの聖地

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

  // 駅検索メソッド
  // const handleChangeStation = (e: { target: any }) => {
  //   const stationData = e.target.value || null;
  //   setStationData(stationData);

  //   // 駅の予測
  //   const predictedStations = jrStations
  //     .filter(
  //       (station) =>
  //         station.kana.startsWith(stationData) ||
  //         station.name.startsWith(stationData)
  //     )
  //     .map((item) => item.name);
  //   setPredStations(predictedStations);
  // };

  // 駅の予測
  const handleChangeStation = async (e: { target: any }) => {
    const userInput = e.target.value;
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
  };

  console.log("stationData", stationData);

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
            onChange={handleChangeStation}
          />
          <div>{}</div>
          <div className="absolute inset-y-0 right-0 flex items-center"></div>
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
            onClick={handleSearchRoute}
          >
            検索
          </button>
        </div>
      </div>
      <button className="bg-gray-500 text-white mx-3 my-5 w-full">
        押してね
      </button>
      {predStations.map((item: Station, index: number) => (
        <li
          key={index}
          className="cursor-pointer"
          onClick={() => handleClickPredSta(item)}
        >
          <p>
            駅名: {item.stationName}（{item.prefecture})
          </p>
        </li>
      ))}

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
