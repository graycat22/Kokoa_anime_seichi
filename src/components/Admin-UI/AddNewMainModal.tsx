import supabase from "@/utils/supabase";
import { addMainPlaces } from "@/utils/supabaseFunctions";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddNewMainModal = ({
  titleId,
  closeMainModal,
  refreshTable,
}: {
  titleId: string;
  closeMainModal: () => void;
  refreshTable: () => void;
}) => {
  const [newPlace, setNewPlace] = useState<string>("");

  const handleAddMainPlace = async () => {
    if (newPlace) {
      const existingMainPlaces = await supabase
        .from("main")
        .select("*")
        .eq("title_id", titleId);
      const existingMainPlacesName = existingMainPlaces.data?.some(
        (mainPlace) => mainPlace.main_place === newPlace
      );
      if (existingMainPlacesName) {
        toast.error("聖地が重複しています！", { duration: 1000 });
      } else {
        await addMainPlaces(titleId, newPlace.trim());
        toast.success("メインの聖地を新たに追加しました！", { duration: 1300 });
        closeMainModal();
        refreshTable();
      }
    }
  };

  return (
    <div className="card card-compact bg-base-100 shadow-2xl rounded-3xl ring ring-gray-100">
      <div className="card-body">
        <h2 className="card-title text-lg">メイン聖地追加</h2>
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
            onClick={handleAddMainPlace}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewMainModal;

// import { addMainPlaces } from "@/utils/supabaseFunctions";
// import React, { useState } from "react";

// const AddNewMeccaModal = ({
//   closeModal,
//   titleId,
// }: {
//   closeModal: () => void;
//   titleId: string;
// }) => {
//   const [newPlace, setNewPlace] = useState<string>("");

//   const handleAddMainPlace = async () => {
//     if (newPlace) {
//       await addMainPlaces(titleId, newPlace.trim());
//     }
//     return;
//   };

//   return (
//     <div className="card card-compact bg-base-100 shadow-2xl rounded-3xl w-full ring ring-gray-100">
//       <div className="card-body">
//         <div className="flex">
//           <h2 className="card-title w-full text-lg">メイン聖地</h2>
//         </div>
//         <input
//           className="input input-bordered"
//           placeholder="新たなる聖地"
//           onChange={(e: React.ChangeEvent<HTMLinputElement>) =>
//             setNewPlace(e.target.value)
//           }
//         ></input>
//         <div className="card-actions justify-end">
//           <button className="btn bg-gray-300" onClick={handleAddMainPlace}>
//             追加
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewMeccaModal;
