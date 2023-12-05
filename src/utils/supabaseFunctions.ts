import supabase from "./supabase";
import toast from "react-hot-toast";

// タイトルのみ取得
export const getAllTitles = async () => {
  const mecca = await supabase
    .from("titles")
    .select("*")
    .order("created_at", { ascending: false }); // 降順

  console.log("これがmecca", mecca);
  return mecca.data || [];
};

// 聖地の情報を取得
export const getAllMecca = async () => {
  const mecca = await supabase
    .from("titles")
    .select("*")
    .order("created_at", { ascending: false });

  const meccaData = await Promise.all(
    mecca.data!.map(async (titleData) => {
      const mainPlace = await supabase
        .from("main")
        .select("*")
        .eq("title_id", titleData.title_id);

      const subPlace = await supabase
        .from("sub")
        .select("*")
        .eq("title_id", titleData.title_id);

      return {
        ...titleData,
        main: mainPlace.data,
        sub: subPlace.data,
      };
    })
  );

  return meccaData;
};

///
// 聖地を追加 //
///
export const addMecca = async (
  title: string,
  kanayomi: string,
  mainPlaces: string[],
  subPlaces: string[]
) => {
  try {
    // kanayomi がカタカナじゃなかったらエラー
    const isKatakana = /^[ァ-ヶー]+$/; // カタカナの正規表現パターン
    if (!isKatakana.test(kanayomi)) {
      // カタカナ以外の文字が含まれている場合の処理
      return toast.error("カナヨミはカタカナを入力してください！", {
        duration: 1000,
      });
    }

    // タイトル重複か確認
    const allTitles = await getAllTitles();
    const existingTitle = allTitles.find((mecca) => mecca.title === title);

    // タイトル重複していない場合はそのまま代入
    if (!existingTitle) {
      if (mainPlaces.some((mainPlace) => mainPlace === "")) {
        toast("メインの聖地を入力してください！", {
          style: {
            backgroundColor: "#111827",
            color: "white",
          },
          icon: "⚠️",
          duration: 2000,
        });
        return;
      }
      const newTitle = await addTitles(title, kanayomi);
      console.log("newTitle", newTitle);

      const newMainPlaces = await addMainPlaces(newTitle.title_id, mainPlaces);

      // subPlaces に空がある場合は代入しない
      if (!subPlaces.some((subPlace) => subPlace === "")) {
        const newSubPlaces = await addSubPlaces(newTitle.title_id, subPlaces);

        toast.success("聖地の追加に成功しました！");
        console.log("聖地の追加成功");
        return [newMainPlaces, newSubPlaces];
      }

      toast.success("聖地の追加に成功しました！", {
        iconTheme: {
          primary: "#fff",
          secondary: "#000",
        },
      });
      console.log("聖地の追加成功");
      return [newMainPlaces, subPlaces];
    }

    // 既存のタイトルである場合
    // title と同じ title_id を持つ main のレコードを取得。
    const { data: findSameTitleMainName } = await supabase
      .from("main")
      .select("*")
      .eq("title_id", existingTitle.title_id);

    // その中にから main_place と同じでない mainPlaces[] を抽出
    const uniqueMainPlaces = mainPlaces.filter(
      (place) =>
        !findSameTitleMainName?.some((record) => record.main_place === place)
    );

    // 一つでもあれば insert し、なかったら終わり
    if (uniqueMainPlaces.length > 0) {
      await addMainPlaces(existingTitle.title_id, uniqueMainPlaces);
      toast.success("メイン聖地の追加に成功しました！");
    }

    // sub の聖地は main の聖地と被ってはいけない
    const existingTitleMainNames =
      findSameTitleMainName?.map((item) => item.main_place) ?? [];
    if (checkDuplicateElements(existingTitleMainNames, subPlaces)) {
      toast.error("サブの聖地と既存のメインの聖地に重複がありました");
      return;
    }

    // 以下 sub 同様
    const { data: findSameTitleSubName } = await supabase
      .from("sub")
      .select("*")
      .eq("title_id", existingTitle.title_id);

    const uniqueSubPlaces = subPlaces.filter(
      (place) =>
        !findSameTitleSubName?.some((record) => record.sub_place === place)
    );

    if (
      uniqueSubPlaces.length > 0 &&
      !uniqueSubPlaces.some((subPlace) => subPlace === "")
    ) {
      await addSubPlaces(existingTitle.title_id, uniqueSubPlaces);
      toast.success("サブ聖地の追加に成功しました！");
    }

    console.log("ユニークなサブプレース", uniqueSubPlaces);
    console.log(
      "!uniqueSubPlaces.some()",
      !uniqueSubPlaces.some((subPlace) => subPlace === "")
    );
    console.log("uniqueSubPlaces.length > 0", uniqueSubPlaces.length > 0);

    if (uniqueMainPlaces.length <= 0 && uniqueSubPlaces.length <= 0) {
      toast.error("メインとサブの聖地が重複しています！");
    } else if (uniqueMainPlaces.length > 0 && uniqueSubPlaces.length <= 0) {
      toast.error("サブの聖地が重複しています！");
    } else if (uniqueMainPlaces.length <= 0 && uniqueSubPlaces.length > 0) {
      toast.error("メインの聖地が重複しています！");
    }
  } catch (error) {
    console.log("聖地追加でエラーが出ました", error);
    toast.error("聖地追加でエラーが出ました");
  }
};

// タイトルを追加
const addTitles = async (title: string, kanayomi: string) => {
  const { data: titleData, error } = await supabase
    .from("titles")
    .insert({ title: title, kanayomi: kanayomi })
    .select();

  if (error) {
    toast.error("タイトル追加でエラーが出ました");
    console.log(error);
    return;
  }
  console.log("タイトルデータ", titleData[0]);
  return titleData[0];
};

// メインを追加
export const addMainPlaces = async (
  titleId: string,
  mainPlaces: string | string[]
) => {
  if (Array.isArray(mainPlaces)) {
    const records = mainPlaces.map((mainPlace) => ({
      title_id: titleId,
      main_place: mainPlace,
    }));
    const { data: mainData, error } = await supabase
      .from("main")
      .insert(records)
      .select();

    if (error) console.log("mainData1", error);

    return mainData;
  }

  const { data: mainData, error } = await supabase
    .from("main")
    .insert({ title_id: titleId, main_place: mainPlaces })
    .select();

  console.log("mainData2", mainData);

  if (error) {
    toast.error("メイン追加でエラーが出ました");
    console.log(error);
    return;
  }

  return mainData;
};

// サブを追加
export const addSubPlaces = async (
  titleId: string,
  subPlaces: string | string[]
) => {
  if (Array.isArray(subPlaces)) {
    const records = subPlaces.map((subPlace) => ({
      title_id: titleId,
      sub_place: subPlace,
    }));
    const { data: subData, error } = await supabase
      .from("sub")
      .insert(records)
      .select();

    return subData;
  }
  const { data: subData, error } = await supabase
    .from("sub")
    .insert({ title_id: titleId, sub_place: subPlaces })
    .select();

  if (error) {
    toast.error("サブ追加でエラーが出ました");
    console.log(error);
    return;
  }

  return subData;
};

////
///
//
// Mecca を更新する関数
export const updateMecca = async (
  titleId: string,
  title: string,
  kanayomi: string,
  mainPlaces: MainType[],
  subPlaces: SubType[]
) => {
  await updateTitle(titleId, title);
  await updateKanayomi(titleId, kanayomi);
  await updateMainPlaces(mainPlaces, titleId);
  await updateSubPlaces(subPlaces, titleId);
};

// タイトルを更新
export const updateTitle = async (titleId: string, title: string) => {
  try {
    const { error } = await supabase
      .from("titles")
      .update({ title: title })
      .eq("title_id", titleId);
    if (error) {
      console.log("タイトルの更新中にエラーが発生しました", error);
      toast.error("タイトルの更新中にエラーが発生しました");
    } else {
      toast.success("タイトルを更新しました");
    }
  } catch (error) {
    toast.error("タイトルの更新中に予期せぬエラーが発生しました");
  }
};

// カナヨミを更新
export const updateKanayomi = async (titleId: string, kanayomi: string) => {
  // kanayomi がカタカナじゃなかったらエラー
  const isKatakana = /^[ァ-ヶー]+$/; // カタカナの正規表現パターン
  if (!isKatakana.test(kanayomi)) {
    // カタカナ以外の文字が含まれている場合の処理
    return toast.error("カナヨミはカタカナを入力してください！", {
      duration: 1000,
    });
  }
  try {
    console.log(kanayomi, titleId);
    const { error } = await supabase
      .from("titles")
      .update({ kanayomi: kanayomi })
      .eq("title_id", titleId);
    if (error) {
      console.log("カナヨミの更新中にエラーが発生しました", error);
      toast.error("カナヨミの更新中にエラーが発生しました");
    } else {
      toast.success("カナヨミを更新しました");
    }
  } catch (error) {
    console.log("カナヨミの更新中に予期せぬエラーが発生しました", error);
    toast.error("カナヨミの更新中に予期せぬエラーが発生しました");
  }
};

// メインの聖地を更新
export const updateMainPlaces = async (
  mainPlaces: MainType[],
  titleId: string
) => {
  try {
    const existingMainPlaces = await supabase
      .from("main")
      .select("*")
      .eq("title_id", titleId);
    console.log("existingMainPlaces", existingMainPlaces);
    let errorDetected = false;

    for (const mainPlace of mainPlaces) {
      // 重複が見つかった場合、その重複を無視して次の処理へ進む
      const isDuplicate = existingMainPlaces.data?.some(
        (existingPlace) =>
          existingPlace.main_place === mainPlace.main_place &&
          existingPlace.title_id === titleId
      );

      if (isDuplicate) {
        toast.error(`サブ聖地は既に存在しています`);
        errorDetected = true;
        continue; // 重複が見つかった場合、次のメイン聖地へ処理を進める
      }

      const { error } = await supabase
        .from("main")
        .update({ main_place: mainPlace.main_place })
        .eq("main_id", mainPlace.main_id);

      if (error) {
        console.error("サブ聖地の更新中にエラーが発生しました", error);
        toast.error("サブ聖地の更新中にエラーが発生しました");
        return;
      }
    }

    if (!errorDetected) {
      toast.success("サブ聖地を更新しました");
    }
  } catch (error) {
    console.log("サブ聖地の更新中にエラーが発生しました", error);
    toast.error("サブ聖地の更新中に予期せぬエラーが発生しました");
  }
};

// サブの聖地を更新
export const updateSubPlaces = async (
  subPlaces: SubType[],
  titleId: string
) => {
  try {
    const existingSubPlaces = await supabase
      .from("sub")
      .select("*")
      .eq("title_id", titleId);
    console.log("existingSubPlaces", existingSubPlaces);
    let errorDetected = false;

    for (const subPlace of subPlaces) {
      // 重複が見つかった場合、その重複を無視して次の処理へ進む
      const isDuplicate = existingSubPlaces.data?.some(
        (existingPlace) =>
          existingPlace.sub_place === subPlace.sub_place &&
          existingPlace.title_id === titleId
      );

      if (isDuplicate) {
        toast.error(`サブ聖地は既に存在しています`);
        errorDetected = true;
        continue; // 重複が見つかった場合、次のサブ聖地へ処理を進める
      }

      const { error } = await supabase
        .from("sub")
        .update({ sub_place: subPlace.sub_place })
        .eq("sub_id", subPlace.sub_id);

      if (error) {
        console.error("サブ聖地の更新中にエラーが発生しました", error);
        toast.error("サブ聖地の更新中にエラーが発生しました");
        return;
      }
    }

    if (!errorDetected) {
      toast.success("サブ聖地を更新しました");
    }
  } catch (error) {
    console.log("サブ聖地の更新中にエラーが発生しました", error);
    toast.error("サブ聖地の更新中に予期せぬエラーが発生しました");
  }
};

// 聖地を削除する関数
export const deleteMecca = async (
  titleId: string,
  mainId: string[],
  subId: string[]
) => {
  await Promise.all(subId.map((sub) => deleteSub(sub)));
  await Promise.all(mainId.map((main) => deleteMain(main)));
  await deleteTitle(titleId);
};

// タイトルを削除する
export const deleteTitle = async (titleId: string) => {
  try {
    const { error } = await supabase
      .from("titles")
      .delete()
      .eq("title_id", titleId);
    console.log(error?.message);
    if (error) return toast.error(`${error}`);
    toast.success("タイトルを削除しました！", { duration: 600 });
  } catch (error) {
    return toast.error("タイトルの削除中に予期せぬエラーが起きました");
  }
};

// メインを削除する関数
export const deleteMain = async (mainId: string) => {
  try {
    const { error } = await supabase
      .from("main")
      .delete()
      .eq("main_id", mainId);
    if (error) return toast.error("削除できませんでした");
    toast.success("メイン聖地を削除しました！", { duration: 600 });
  } catch (error) {
    return toast.error("メイン聖地の削除中に予期せぬエラーが起きました");
  }
};

// サブを削除する関数
export const deleteSub = async (subId: string) => {
  try {
    const { error } = await supabase.from("sub").delete().eq("sub_id", subId);
    if (error) return toast.error("削除できませんでした");
    toast.success("サブ聖地を削除しました！", { duration: 600 });
  } catch (error) {
    return toast.error("サブ聖地削除中に予期せぬエラーが起きました");
  }
};

// 重複チェック関数
export const checkDuplicates = (array: string[]) => {
  const set = new Set<string>();
  for (const item of array) {
    if (set.has(item)) {
      return true;
    } else {
      set.add(item);
    }
  }
};

// 重複チェック関数
export const checkDuplicateElements = (main: string[], sub: string[]) => {
  for (let i = 0; i < main.length; i++) {
    for (let j = 0; j < sub.length; j++) {
      if (main[i] === "" && sub[j] == "") {
        return "空";
      }
      if (main[i] === sub[j]) {
        return true; // 同じ要素が見つかった場合、trueを返す（エラー）
      }
    }
  }
  return false; // 同じ要素が見つからなかった場合、falseを返す（エラーなし）
};
