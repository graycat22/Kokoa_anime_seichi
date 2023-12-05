import {
  addMecca,
  checkDuplicateElements,
  checkDuplicates,
} from "@/utils/supabaseFunctions";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const MeccaModal = ({
  triggerTableReverse,
}: {
  triggerTableReverse: () => void;
}) => {
  const [title, setTitle] = useState<string>("");
  const [kanayomi, setKanayomi] = useState<string>("");
  const [main, setMain] = useState<string[]>([""]);
  const [sub, setSub] = useState<string[]>([""]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  console.log("title", title, "main", main, "sub", sub);

  // モーダル開閉
  const handleModal = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
    }
  };

  // mainの数によって配列に入れる
  const handleMainChange = (index: number, value: string) => {
    const updatedMain = [...main];
    updatedMain[index] = value;
    setMain(updatedMain);
  };

  const addMainInput = () => {
    setMain([...main, ""]);
  };
  const deleteMainInput = (index: number) => {
    if (index === 0) return;
    const updatedMain = [...main];
    updatedMain.splice(index, 1);
    setMain(updatedMain);
  };

  const handleSubChange = (index: number, value: string) => {
    const updatedSub = [...sub];
    updatedSub[index] = value;
    setSub(updatedSub);
  };

  const addSubInput = () => {
    setSub([...sub, ""]);
  };
  const deleteSubInput = (index: number) => {
    if (index === 0) return;
    const updatedSub = [...sub];
    updatedSub.splice(index, 1);
    setSub(updatedSub);
  };

  const handleResetForm = () => {
    setTitle("");
    setKanayomi("");
    setMain([""]);
    setSub([""]);
  };

  const handleAddMecca = async () => {
    // button を disable にする
    // const button = document.querySelector(".submit-button");
    // button?.classList.add("loading");
    // button?.classList.add("loading-spinner");
    // button?.setAttribute("disabled", "disabled");

    try {
      // title がないとき
      if (!title) {
        toast.error("タイトルを入力してください！");
        return;
      }
      if (!kanayomi) {
        toast.error("カナヨミを入力してください！");
        return;
      }

      // 空の要素が含まれるインデックスを特定
      const emptyMainIndex = main.findIndex((value) => value === "");
      const emptySubIndex = sub.findIndex((value) => value === "");
      console.log("emptyMainIndex", emptyMainIndex);
      console.log("emptySubIndex", emptySubIndex);
      if (emptyMainIndex >= 0) {
        // 空の要素を削除
        const updatedMain = main.filter((_, index) => index !== emptyMainIndex);
        if (main.length !== 1) {
          setMain(updatedMain);
          toast("空のメインを削除しました", { duration: 800 });
        }
      }

      if (emptySubIndex >= 0) {
        const updatedSub = sub.filter((_, index) => index !== emptySubIndex);
        if (sub.length !== 1) {
          setSub(updatedSub);
          toast("空のサブを削除しました", { duration: 36000 });
        }
      }

      if (emptyMainIndex >= 0 && emptySubIndex >= 0) return;

      // main[i] === main[j], sub[i] === sub[j] の重複チェック
      if (checkDuplicates(main) || checkDuplicates(sub)) {
        return toast.error("入力が重複しています");
      }

      // main[i] === sub[j] の重複チェック
      if (checkDuplicateElements(main, sub) === "空") {
        return toast("メインの聖地とサブの聖地を入力してください");
      }
      if (checkDuplicateElements(main, sub)) {
        return toast.error("メインの聖地とサブの聖地に重複があります");
      }

      await addMecca(title, kanayomi, main, sub);
      dialogRef.current?.close();
      handleResetForm();
      triggerTableReverse(); // Table の再レンダリング発火
    } catch (error) {
      console.log("サブミットエラー", error);
      toast.error("予期せぬエラーがが起こりました");
    }
    // button?.classList.remove("loading");
    // button?.classList.remove("loading-spinner");
    // button?.removeAttribute("disabled");
  };

  return (
    <div>
      <div>
        <a className="link link-hover font-semibold" onClick={handleModal}>
          奉納
        </a>
      </div>
      <dialog id="table-modal" className="modal" ref={dialogRef}>
        <Toaster />
        <div className="modal-box flex-row">
          <div className="w-fit mx-auto mt-5">
            <div className="w-fit">
              <p className="font-bold text-lg w-fit">聖地を登録</p>
            </div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-xs">カナヨミ</span>
              </div>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Required"
                value={kanayomi}
                className="input input-xs input-bordered w-full max-w-xs mb-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKanayomi(e.target.value.trim())
                }
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">アニメのタイトル</span>
                <button className="btn btn-xs pt-1">?</button>
              </div>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Required"
                className="input input-bordered w-full max-w-xs mb-2"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value.trim())
                }
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">メインの聖地</span>
                <button
                  className="btn btn-xs ml-4 pt-1"
                  onClick={() => deleteMainInput(main.length - 1)}
                >
                  －
                </button>
                <button className="btn btn-xs pt-1" onClick={addMainInput}>
                  ＋
                </button>
              </div>
              <input
                type="text"
                id="main1"
                name="main"
                placeholder="Type here"
                required
                value={main[0]}
                className="input input-bordered w-full max-w-xs mb-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMainChange(0, e.target.value.trim())
                }
              />
              {main.map(
                (value, index) =>
                  index > 0 && (
                    <input
                      key={index}
                      type="text"
                      id={`name${index}`}
                      name="name"
                      placeholder="Type here..."
                      className="input input-bordered w-full max-w-xs mb-2"
                      value={value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleMainChange(index, e.target.value.trim())
                      }
                    />
                  )
              )}
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">サブの聖地</span>
                <button
                  className="btn btn-xs ml-8 pt-1"
                  onClick={() => deleteSubInput(sub.length - 1)}
                >
                  －
                </button>
                <button className="btn btn-xs pt-1" onClick={addSubInput}>
                  ＋
                </button>
              </div>
              <input
                type="text"
                id="sub"
                name="sub"
                placeholder="Not required"
                value={sub[0]}
                className="input input-bordered w-full max-w-xs mb-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSubChange(0, e.target.value.trim())
                }
              />
            </label>
            {sub.map(
              (value, index) =>
                index > 0 && (
                  <input
                    key={index}
                    type="text"
                    id={`sub${index}`}
                    name="sub"
                    placeholder="Type here..."
                    className="input input-bordered w-full max-w-xs mb-2"
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSubChange(index, e.target.value.trim())
                    }
                  />
                )
            )}
            <div className="flex justify-end">
              <button
                className="btn submit-button tracking-eide mt-2"
                onClick={handleAddMecca}
              >
                submit
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MeccaModal;
