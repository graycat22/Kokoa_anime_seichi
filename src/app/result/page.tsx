"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Result = () => {
  const searchParams = useSearchParams();
  const [pref, code] = [searchParams.get("pref"), searchParams.get("code")];
  const [result, setResult] = useState<any[]>([]);

  // 到着駅

  const transitData = [
    { time: "08:00", station: "Station A", platform: "Platform 1" },
    { time: "08:30", station: "Station B", platform: "Platform 2" },
    { time: "09:00", station: "Station C", platform: "Platform 3" },
    { time: "09:30", station: "Station D", platform: "Platform 4" },
    // 他の行も同様に追加
  ];

  // 初回読み込み(prefとcodeが変化)時に発火
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/search/${pref}&${code}`,
          { cache: "no-store" }
        );
        const result = await res.json();
        setResult(result);
        console.log("ルートのデータ", result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [pref, code]);

  const handleRoute = () => {
    console.log("course2:", result[1]);
  };

  // const course1 = result[0].course1;
  // const course2 = result[1].course2;
  // const course3 = result[2].course3;
  // const course4 = result[3].course4;
  // console.log(course1);

  return (
    <div>
      <button className="bg-red-400" onClick={handleRoute}>
        ああ
      </button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Station
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transitData.map((row, index) => (
            <React.Fragment key={index}>
              {/* 奇数行 */}
              <tr className={(index + 1) % 2 !== 0 ? "bg-gray-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.station}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.platform}
                </td>
              </tr>
              {/* 偶数行 */}
              {(index + 1) % 2 === 0 && (
                <tr className="bg-white">
                  <td className="px-6 py-4" colSpan={3}>
                    {/* 電車のアイコンなどを表示する部分 */}
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 1a1 1 0 0 1 .707.293l8 8a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414-1.414L16.586 10 9.293 2.707a1 1 0 0 1 0-1.414A1 1 0 0 1 10 1zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                        />
                      </svg>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {row.time} - {row.station}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
