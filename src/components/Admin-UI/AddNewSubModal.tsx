import supabase from "@/utils/supabase";
import { addSubPlaces } from "@/utils/supabaseFunctions";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddNewSubModal = ({
  titleId,
  closeSubModal,
  refreshTable,
}: {
  titleId: string;
  closeSubModal: () => void;
  refreshTable: () => void;
}) => {
  const [newPlace, setNewPlace] = useState<string>("");

  const handleAddSubPlace = async () => {
    if (newPlace) {
      const existingSubPlaces = await supabase
        .from("sub")
        .select("*")
        .eq("title_id", titleId);
      const existingSubPlacesName = existingSubPlaces.data?.some(
        (subPlace) => subPlace.sub_place === newPlace
      );
      if (existingSubPlacesName) {
        toast.error("聖地が重複しています！", { duration: 1000 });
      } else {
        await addSubPlaces(titleId, newPlace.trim());
        toast.success("サブの聖地を新たに追加しました！", { duration: 1300 });
        closeSubModal();
        refreshTable();
      }
    }
  };

  return (
    <div className="card card-compact bg-base-100 shadow-2xl rounded-3xl ring ring-gray-100">
      <div className="card-body">
        <h2 className="card-title text-lg">サブ聖地追加</h2>
        <input
          className="input input-bordered focus:border-violet-300 focus:outline-violet-300"
          placeholder="新たなる聖地"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPlace(e.target.value)
          }
        ></input>
        <div className="card-actions justify-end -mb-2">
          <button
            className="btn bg-violet-300 hover:bg-violet-400 text-gray-100 hover:text-gray-700"
            onClick={handleAddSubPlace}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewSubModal;
