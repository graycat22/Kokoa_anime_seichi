// const cors = require("cors");
// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const app = express();

// import { NextResponse, NextRequest } from "next/server";

// app.use(cors());

// app.get("/scrape", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://animetourism88.com/ja/88AnimeSpot"
//     );
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const titles = $(".spot-title") // spot-title クラスの中身だけ抜き出し
//       .map((index, element) => $(element).text().trim())
//       .get();

//     const prefectures = $(".spot-location") // spot-title クラスの中身だけ抜き出し
//       .map((index, element) => $(element).text().trim())
//       .get();

//     const formattedData = titles.map((title, index) => ({
//       title: title,
//       prefecture: prefectures[index],
//       stamp: false,
//     }));

//     res.json({ formattedData });
//   } catch (error) {
//     console.error("エラーが発生しました:", error);
//     res.status(500).json({ error: "スクレイピング中にエラーが発生しました" });
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`サーバーがポート ${PORT} で起動しました`);
// });

// const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

export const GET = async (req, res) => {
  const response = await axios.get(`https://animetourism88.com/ja/88AnimeSpot`);
  const $ = cheerio.load(response.data);

  // console.log($);

  // const titles = $(".spot-title") // spot-title クラスの中身だけ抜き出し
  //   .map((index, element) => $(element).text().trim())
  //   .get();

  // const prefectures = $(".spot-location") // spot-title クラスの中身だけ抜き出し
  //   .map((index, element) => $(element).text().trim())
  //   .get();

  // const formattedData = titles.map((title, index) => ({
  //   title: title,
  //   prefecture: prefectures[index],
  //   stamp: false,
  // }));

  // res.json({ formattedData });
};
