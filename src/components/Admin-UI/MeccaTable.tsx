import {
  checkDuplicates,
  deleteMain,
  deleteSub,
  getAllMecca,
  updateKanayomi,
  updateMainPlaces,
  updateSubPlaces,
  updateTitle,
} from "@/utils/supabaseFunctions";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import AlertWithButtons from "./AlertWithButtons";
import AddNewMainModal from "./AddNewMainModal";
import AddNewSubModal from "./AddNewSubModal";

const MeccaTable = ({ isReversed }: { isReversed: boolean }) => {
  const [isActiveRow, setIsActiveRow] = useState<string | null>(null);
  const [mecca, setMecca] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>(""); // React の制御をつける
  const [selectedKanayomi, setSelectedKanayomi] = useState<string>("");
  const [selectedMainPlaces, setSelectedMainPlaces] = useState<MainType[]>([]);
  const [selectedSubPlaces, setSelectedSubPlaces] = useState<SubType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [isMainModalOpen, setIsMainModalOpen] = useState<boolean>(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState<boolean>(false);
  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // 自動更新,リーバース時に更新
  useEffect(() => {
    const fetchData = async () => {
      try {
        let fetchedMecca = await getAllMecca();
        if (isReversed) {
          fetchedMecca = fetchedMecca.reverse();
        }
        console.log("これがクライアントfetchedmecca", fetchedMecca);
        setMecca(fetchedMecca);
      } catch (error) {
        console.error("データの取得中にエラーが発生しました", error);
      }
    };

    const fetchDataAndToast = async () => {
      const myPromise = fetchData();
      toast.promise(
        myPromise,
        {
          loading: "取得中…",
          success: "祈禱成就",
          error: "エラーが起こりました",
        },
        {
          iconTheme: {
            primary: "#fff",
            secondary: "#000",
          },
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
          success: {
            duration: 1300,
          },
          error: {
            duration: 1600,
          },
        }
      );
    };

    // 初回読み込み時のデータ取得とトースト表示
    fetchDataAndToast();

    // 60秒ごとにデータをリフレッシュする
    const interval = setInterval(fetchDataAndToast, 480000);

    // コンポーネントがアンマウントされたときにインターバルをクリアする
    return () => clearInterval(interval);
  }, [isReversed, count]);

  const handleRefresh = () => {
    setCount(count - 1);
  };

  const handleCloseDialog = () => {
    dialogRef.current?.close();
    setIsActiveRow(null);
  };

  console.log("mecca", mecca);

  // active クラスつける or つけない
  const handleAddActive = (anime: Anime) => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      setIsActiveRow(anime.title_id === isActiveRow ? null : anime.title_id);
      setSelectedAnime(anime);

      // selectedKanayomi の state に初期値をセット
      setSelectedKanayomi(anime.kanayomi);

      // selectedTitle の state に初期値をセット
      setSelectedTitle(anime.title);

      // main の配列を MainType 型に変えてセット
      const main_places = anime.main.map((item: any) => ({
        main_id: item.main_id,
        main_place: item.main_place,
      }));
      setSelectedMainPlaces(main_places);

      // sub の配列を SubType 型に変えてセット
      const selectedSubPlaces = anime.sub.map((item: any) => ({
        sub_id: item.sub_id,
        sub_place: item.sub_place,
      }));
      setSelectedSubPlaces(selectedSubPlaces);
    }
  };

  console.log("selectedAnime", selectedAnime);

  const handleMainChange = (value: string, index: number) => {
    const newMainValue = [...selectedMainPlaces];
    newMainValue[index] = { ...newMainValue[index], main_place: value };
    setSelectedMainPlaces(newMainValue);
  };

  const handleSubChange = (value: string, index: number) => {
    const newSubValue = [...selectedSubPlaces];
    newSubValue[index] = { ...newSubValue[index], sub_place: value };
    setSelectedSubPlaces(newSubValue);
  };

  console.log("selectedMainPlaces", selectedMainPlaces);
  console.log("setSelectedSubPlaces", selectedSubPlaces);

  const handleUpdate = async () => {
    let result1 = await handleUpdateKanayomi();
    let result2 = await handleUpdateTitle();
    let result3 = await handleUpdateMain();
    let result4 = await handleUpdateSub();
    console.log("result", result1, result2, result3, result4);
    if (
      result1 === null ||
      result2 === null ||
      result3 === null ||
      result4 === null
    ) {
      if (dialogRef.current) {
        handleCloseDialog();
      }
      setCount(count + 1);
    }
  };

  // カナヨミを更新する関数
  const handleUpdateKanayomi = async () => {
    if (selectedKanayomi === selectedAnime?.kanayomi) return;
    if (!selectedKanayomi) return toast.error("カナヨミを入力して下さい");

    console.log(`selectedAnim`, selectedKanayomi, selectedAnime?.kanayomi);
    await updateKanayomi(selectedAnime!.title_id, selectedKanayomi);
    return null;
  };

  // タイトルを更新する関数
  const handleUpdateTitle = async () => {
    if (selectedTitle === selectedAnime?.title) return;
    if (!selectedTitle) return toast.error("タイトルを入力して下さい");

    console.log(`selectedAnim`, selectedTitle, selectedAnime?.title_id);
    await updateTitle(selectedAnime!.title_id, selectedTitle);
    return null;
  };

  // メインを更新する関数
  const handleUpdateMain = async () => {
    if (
      checkDuplicates(
        selectedMainPlaces.map((mainPlace) => mainPlace.main_place)
      )
    )
      return toast.error(
        "メイン聖地が重複しています。データベースで重複しているかは分かりません！"
      );

    const updatedMainPlaces = selectedMainPlaces.filter((mainPlace, index) => {
      return mainPlace.main_place !== selectedAnime?.main[index].main_place;
    });

    console.log("updatedMainPlaces", updatedMainPlaces);

    if (updatedMainPlaces.length === 0) return;

    // 一つでも null だったらだめ。
    if (updatedMainPlaces.some((mainPlace) => mainPlace.main_place === ""))
      return toast("空の入力があります");

    await updateMainPlaces(updatedMainPlaces, selectedAnime!.title_id);
    return null;
  };

  // サブを更新する関数
  const handleUpdateSub = async () => {
    if (
      checkDuplicates(selectedSubPlaces.map((subPlace) => subPlace.sub_place))
    )
      return toast.error(
        "サブ聖地が重複しています。データベースで重複しているかは分かりません！"
      );

    const updatedSubPlaces = selectedSubPlaces.filter((subPlace, index) => {
      return subPlace.sub_place !== selectedAnime?.sub[index].sub_place;
    });

    console.log("updatedSubPlaces", updatedSubPlaces);

    if (updatedSubPlaces.length === 0) return;

    // 一つでも null だったらだめ。
    if (updatedSubPlaces.some((subPlace) => subPlace.sub_place === ""))
      return toast("空の入力があります");

    await updateSubPlaces(updatedSubPlaces, selectedAnime!.title_id);
    return null;
  };

  // タイトル削除アラートを出すかどうか
  const handleOpenAlert = () => {
    setIsAlertVisible(!isAlertVisible);
  };

  const handleOpenMainModal = () => {
    setIsMainModalOpen(!isMainModalOpen);
  };

  const handleOpenSubModal = () => {
    setIsSubModalOpen(!isSubModalOpen);
  };

  // ゴミ箱
  const handleDropSub = async (e: any, target: string) => {
    e.preventDefault();
    const droppedData = e.dataTransfer.getData("application/json");
    const parsedDroppedData = JSON.parse(droppedData);

    let droppedId;

    if (parsedDroppedData?.sub_id) {
      // sub_id が存在する場合
      droppedId = parsedDroppedData.sub_id;
      console.log("これは a sub_id:", droppedId);
      if (target === "trash") {
        console.log("ドロップされた要素のid:", droppedId.slice(0, 5));
        await deleteSub(droppedId);
        const hideSubInput = document.querySelector(
          `.a${droppedId.slice(0, 5)}`
        );
        hideSubInput?.setAttribute("disabled", "disabled");
        const hideSubDiv = document.querySelector(`.b${droppedId.slice(0, 5)}`);
        hideSubDiv?.setAttribute("draggable", "false");
        handleRefresh();
      }
    } else if (parsedDroppedData?.main_id) {
      // main_id が存在する場合
      droppedId = parsedDroppedData.main_id;
      console.log("これは main_id:", droppedId);
      if (target === "trash") {
        console.log("ドロップされた要素のid:", droppedId.slice(0, 5));
        await deleteMain(droppedId);
        const hideMainInput = document.querySelector(
          `.a${droppedId.slice(0, 5)}`
        );
        hideMainInput?.setAttribute("disabled", "disabled");
        const hideMainDiv = document.querySelector(
          `.b${droppedId.slice(0, 5)}`
        );
        hideMainDiv?.setAttribute("draggable", "false");
        handleRefresh();
      }
    } else {
      // どちらも存在しない場合や、不正なデータの場合など
      console.log("Invalid or missing IDs in droppedData");
      return; // エラー処理や早期リターンを行う
    }
  };

  const handleMasterCheckbox = () => {
    setIsCheckedAll((prev) => !prev);
    if (!isCheckedAll) {
      const allIds = mecca.map((anime) => anime.title_id);
      setCheckedItems(allIds);
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheckbox = (titleId: string) => {
    setCheckedItems((prevItems) => {
      // 与えられた値が配列に含まれているか
      const isChecked = prevItems.includes(titleId);

      if (!isChecked) {
        return [...prevItems, titleId];
      } else {
        return prevItems.filter((id) => id != titleId);
      }
    });
    setIsCheckedAll(false);
  };

  console.log("チェックボックス", checkedItems);

  return (
    <div className="overflow-x-auto mb-16">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox border-violet-300 tooltip tooltip-right [--chkbg:theme(colors.violet.300)] [--chkfg:oklch(var(--sc))]"
                  name="checkbox"
                  checked={isCheckedAll}
                  data-tip={`${checkedItems.length}件選択中`}
                  onChange={handleMasterCheckbox}
                />
              </label>
            </th>
            <th className="text-left">Title Name</th>
            <th className="text-center sm:text-left">Main Mecca</th>
            <th className="text-center sm:text-left">Sub Mecca</th>
          </tr>
        </thead>
        <tbody>
          {mecca.map((anime: Anime) => (
            <tr
              key={anime.title_id}
              className={`${
                anime.title_id === isActiveRow ? "active" : ""
              } hover cursor-pointer`}
            >
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox border-violet-300 [--chkbg:theme(colors.violet.300)] [--chkfg:oklch(var(--sc))]"
                    name="checkbox"
                    checked={checkedItems.includes(anime.title_id)}
                    onChange={() => handleCheckbox(anime.title_id)}
                  />
                </label>
              </th>
              <td
                onClick={() => {
                  handleAddActive(anime);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="font-semibold">{anime.title}</div>
                </div>
              </td>
              <td
                onClick={() => {
                  handleAddActive(anime);
                }}
              >
                {anime.main.map((mainPlaces: any, index: number) => (
                  <p key={index}> {mainPlaces.main_place}</p>
                ))}
              </td>
              <td
                onClick={() => {
                  handleAddActive(anime);
                }}
              >
                {anime.sub.map((selectedSubPlaces: any, index: number) => (
                  <p key={index}>{selectedSubPlaces.sub_place}</p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <dialog
        ref={dialogRef}
        id="modal_window"
        className="modal modal-bottom sm:modal-middle"
      >
        <Toaster />
        <div
          className="modal-box overflow-y-auto"
          style={{ maxHeight: "543px" }}
        >
          <div className="w-80 mx-auto">
            <h3 className="inline font-bold text-lg">祈祷</h3>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-xs">フリガナ</span>
                <span className="label-text-alt">Make It Katakana</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                value={selectedKanayomi}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSelectedKanayomi(e.target.value.trim())
                }
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">アニメのタイトル</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                value={selectedTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSelectedTitle(e.target.value.trim())
                }
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                {!isMainModalOpen ? (
                  <>
                    <span className="label-text">メインの聖地</span>
                    <span
                      className="label-text-alt text-lg hover:animate-ping cursor-pointer"
                      onClick={() => setIsMainModalOpen(!isMainModalOpen)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="14"
                        viewBox="0 0 448 512"
                      >
                        <path
                          fill="#A78BFA"
                          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                        />
                      </svg>
                    </span>
                  </>
                ) : (
                  <div className="relative w-full">
                    <AddNewMainModal
                      closeMainModal={handleOpenMainModal}
                      refreshTable={handleRefresh}
                      titleId={selectedAnime!.title_id}
                    />
                    <button
                      className="btn btn-sm bg-white border-none shadow-none absolute top-2 right-2 hover:bg-violet-300 hover:text-gray-100"
                      onClick={() => setIsMainModalOpen(!isMainModalOpen)}
                    >
                      ✖
                    </button>
                  </div>
                )}
              </div>
              {selectedAnime?.main.map((mainPlaces: any, index: number) => (
                <div
                  key={mainPlaces.main_id}
                  className={`relative b${mainPlaces.main_id.slice(0, 5)}`}
                  draggable={true}
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({ main_id: mainPlaces.main_id })
                    )
                  }
                >
                  <input
                    type="text"
                    placeholder="Type here"
                    className={`input input-bordered w-full max-w-xs mb-1.5 a${mainPlaces.main_id.slice(
                      0,
                      5
                    )}`}
                    key={mainPlaces.main_id}
                    value={selectedMainPlaces[index].main_place}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleMainChange(e.target.value.trim(), index)
                    }
                  />
                  <svg
                    className="absolute right-4 top-4 cursor-move"
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="14"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#A78BFA"
                      d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                    />
                  </svg>
                </div>
              ))}
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                {!isSubModalOpen ? (
                  <>
                    <span className="label-text">サブの聖地</span>
                    <span
                      className="label-text-alt text-lg hover:animate-ping cursor-pointer"
                      onClick={() => setIsSubModalOpen(!isSubModalOpen)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="14"
                        viewBox="0 0 448 512"
                      >
                        <path
                          fill="#A78BFA"
                          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                        />
                      </svg>
                    </span>
                  </>
                ) : (
                  <div className="relative w-full">
                    <AddNewSubModal
                      closeSubModal={handleOpenSubModal}
                      refreshTable={handleRefresh}
                      titleId={selectedAnime!.title_id}
                    />
                    <button
                      className="btn btn-sm bg-white border-none shadow-none absolute top-2 right-2 hover:bg-violet-300 hover:text-gray-100"
                      onClick={() => setIsSubModalOpen(!isSubModalOpen)}
                    >
                      ✖
                    </button>
                  </div>
                )}
              </div>
              {selectedAnime?.sub.map((subPlaces: any, index: number) => (
                <div
                  key={subPlaces.sub_id}
                  className={`relative b${subPlaces.sub_id.slice(0, 5)}`}
                  draggable={true}
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({ sub_id: subPlaces.sub_id })
                    )
                  }
                >
                  <input
                    type="text"
                    placeholder="Type here"
                    className={`input input-bordered w-full max-w-xs mb-1.5 a${subPlaces.sub_id.slice(
                      0,
                      5
                    )}`}
                    value={selectedSubPlaces[index].sub_place}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSubChange(e.target.value.trim(), index)
                    }
                  />
                  <svg
                    className="absolute right-4 top-4 cursor-move"
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="14"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#A78BFA"
                      d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                    />
                  </svg>
                </div>
              ))}
            </label>

            <div className="flex justify-between">
              <div
                onDrop={(e) => handleDropSub(e, "trash")}
                onDragOver={(e) => e.preventDefault()}
                className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center cursor-pointer relative"
              >
                Trash
              </div>
              <div>
                <button
                  className="btn btn-outline sm:btn-sm md:btn-md lg:btn-lg"
                  onClick={handleOpenAlert}
                >
                  Delete
                </button>
                <button
                  className="btn btn-outline sm:btn-sm md:btn-md lg:btn-lg ml-2"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsActiveRow(null)}>close</button>
        </form>
        {isAlertVisible && (
          <AlertWithButtons
            titleId={selectedAnime?.title_id!}
            mainId={selectedAnime?.main.map((anime) => anime.main_id) || []}
            subId={selectedAnime?.sub.map((anime) => anime.sub_id) || []}
            closeAlert={handleOpenAlert}
            refreshTable={handleRefresh}
            closeDialog={handleCloseDialog}
          />
        )}
      </dialog>
    </div>
  );
};

export default MeccaTable;
