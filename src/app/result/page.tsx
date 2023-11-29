"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TsukimoriLogo from "@/components/Tsukimori logo";

const Result = () => {
  const searchParams = useSearchParams();
  const [pref, code] = [searchParams.get("pref"), searchParams.get("code")];
  const [result, setResult] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // ページ遷移アニメーション用
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    });
    return () => clearInterval(interval);
  }, []);

  // 初回読み込み(prefとcodeが変化)時に発火
  useEffect(() => {
    setIsLoaded(true);
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/search/${pref}&${code}`
        ); // ${process.env.NEXT_PUBLIC_API_URL}
        const result = await res.json();
        setResult(result);
        console.log("ルートのデータ", result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const myPromise = fetchData();
    toast.promise(
      myPromise,
      {
        loading: "ロード中…",
        success: "成功！",
        error: "失敗しました T T",
      },
      {
        icon: "🚃",
        style: { background: "rgb(221 214 254)" },
        success: { duration: 1500 },
      }
    );
  }, [pref, code]);

  const returnTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    // result[{${i}}]として i < 4; i++ でループ
    <div className="sm:w-screen md:w-11/12 mx-auto">
      {result.length > 0 && (
        <header className="mt-2 flex h-5 justify-between lg:mx-3">
          <div className="flex justify-between w-full md:w-11/12 lg:w-1/2 md:mx-auto">
            <div className="chua-header flex justify-between h-fit -mt-1.5  border-b-2 border-violet-500">
              <div className="result-header-container flex items-end ">
                <Image
                  src="/Chuachan.png"
                  alt="I am Chua"
                  width={28}
                  height={28}
                />
                <div className="header-antuor inline-block leading-none ml-16 mr-4 text-sm text-gray-800 font-mono tracking-wide">
                  Antuor
                </div>
              </div>
            </div>
            <div className="header-time inline-block w-40 mr-4 text-sm text-right lg:mr-0">
              <p
                className="inline-block text-cyan-800"
                style={{ marginRight: "0.3rem" }}
              >
                <FontAwesomeIcon
                  icon={faClock}
                  bounce
                  className="text-xl"
                  color="#a386c6"
                />
              </p>
              {currentTime.toLocaleString()}
            </div>
          </div>
        </header>
      )}
      <div
        className={`mx-auto mb-16 px-2 max-w-screen-lg md:flex md:flex-wrap md:w-full md:mt-2 transition-opacity duration-1500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Toaster />
        {result.length > 0 &&
          [1, 2, 3, 4].map((i) => (
            <section
              key={i}
              id="section"
              className="mt-1 mb-6 rounded-xl overflow-hidden border-t-4 border-b-8 border-r-4 border-l-4 border-white bg-gray-200 md:w-1/2 md:h-fit md:my-auto"
            >
              <div className="border-2 border-gray-200 md:p-2 md:m-2 md:border-0">
                <table className="w-full divide-y divide-gray-200 rounded-lg">
                  {result[i - 1][`course${i}`].map(
                    (row: any, index: number) => (
                      <tbody
                        key={index}
                        className="bg-white divide-y divide-gray-200"
                      >
                        {index === 0 ? (
                          <tr className="relative w-full h-12 border-t bg-gray-200">
                            <td className="absolute py-3 ml-2 mt-1 text-left text-sm font-medium text-gray-800 tracking-wider">
                              ルート {i}
                            </td>
                            <td className="absolute right-0.5 mt-5 text-left text-xs font-medium text-gray-500 tracking-wide">
                              所要時間: {row.totalDuration}, &nbsp; 片道:&nbsp;
                              {row.totalFare} 円, &nbsp; 乗換: {row.changes} 回
                            </td>
                          </tr>
                        ) : index % 2 !== 0 ? (
                          // 色あり奇数行(index === 偶数)
                          <tr className="w-2/12 bg-violet-200 rounded-xl overflow-hidden">
                            <td className="h-12 whitespace-nowrap text-xs text-center font-normal text-gray-500">
                              {row.time.arrivalTime && (
                                <>
                                  到着 {row.time.arrivalTime}
                                  <br />
                                </>
                              )}
                              {row.time.departureTime && (
                                <>出発 {row.time.departureTime}</>
                              )}
                            </td>
                            <td className="w-5/12 h-12 whitespace-normal text-bg text-center text-gray-500 border-l-4 border-gray-400">
                              {row.station}
                            </td>
                            <td className="w-4/12 h-12 whitespace-nowrap text-xs text-gray-500">
                              {row.info.arrivalPlatform && (
                                <span className="pl-4">
                                  到着 {row.info.arrivalPlatform} 番線
                                  <br />
                                </span>
                              )}
                              {row.info.departurePlatform && (
                                <span className="pl-4">
                                  出発 {row.info.departurePlatform} 番線
                                </span>
                              )}
                            </td>
                            <td
                              className={`relative w-1/12 h-12 whitespace-normal text-xs text-left align-bottom text-gray-500 ${
                                row.fare ? "" : "border-gray-300 border-l-2"
                              }`}
                            >
                              {row.fare && row.fare.toString().length === 4 ? (
                                <span className="absolute -ml-5 -mt-4">
                                  &yen;{row.fare}
                                </span>
                              ) : row.fare &&
                                row.fare.toString().length === 3 ? (
                                <span className="absolute -ml-4 -mt-4">
                                  &yen;{row.fare}
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        ) : (
                          // 奇数行(index === 偶数)
                          <tr>
                            <td className="h-16 whitespace-normal text-xs text-center font-medium text-gray-500">
                              {row.time.duration}分/{row.time.stations}駅
                            </td>
                            <td className="h-16 whitespace-normal text-xs text-center text-gray-500">
                              {row.info}
                            </td>
                            <td className="h-16 whitespace-normal text-sm text-center text-gray-500">
                              {row.changes}
                            </td>
                            <td className="h-16 whitespace-normal text-sm text-center text-gray-500 border-gray-300 border-l-2"></td>
                          </tr>
                        )}
                      </tbody>
                    )
                  )}
                </table>
              </div>
            </section>
          ))}
        <button
          className="fixed z-20 bottom-4 right-4 lg:right-40 button-020"
          aria-label="scrollTop"
          onClick={returnTop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill="#ffffff"
              d="m12.9 5.1 10.7 10.7c.5.5.5 1.4 0 1.9l-1.2 1.2c-.5.5-1.3.5-1.9 0L12 10.4l-8.5 8.5c-.5.5-1.3.5-1.9 0L.4 17.7c-.5-.5-.5-1.4 0-1.9L11.1 5.1c.5-.5 1.3-.5 1.8 0z"
            />
          </svg>
        </button>
        <button
          id="top-page-button"
          className="fixed z-20 bottom-4 left-4 lg:left-40 py-2 text-white transition-all duration-100 rounded-2xl"
        >
          <Link href="/" className="py-3 px-6 rounded-2xl">
            聖地巡礼地を探す
          </Link>
        </button>
        {result.length > 0 || (
          <p className="pl-3 text-sm">Powered by HeartRails...</p>
        )}
      </div>
      {result.length > 0 ? (
        <TsukimoriLogo />
      ) : (
        <div
          className={`mt-32 md:hidden ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <TsukimoriLogo />
        </div>
      )}
    </div>
  );
};

export default Result;
