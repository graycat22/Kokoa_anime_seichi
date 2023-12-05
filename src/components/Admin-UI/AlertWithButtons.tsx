import { deleteMain, deleteMecca } from "@/utils/supabaseFunctions";
import toast from "react-hot-toast";

const AlertWithButtons = ({
  titleId,
  mainId,
  subId,
  closeAlert,
  refreshTable,
  closeDialog,
}: {
  titleId: string;
  mainId: string[];
  subId: string[];
  closeAlert: () => void;
  refreshTable: () => void;
  closeDialog: () => void;
}) => {
  const handleDeny = () => {
    toast("消さんのかい", {
      duration: 1100,
      style: { backgroundColor: "black", color: "white", fontSize: "1.5rem" },
    });
    closeAlert();
  };

  const handleAccept = async () => {
    await deleteMecca(titleId, mainId, subId);
    toast.success("聖地を削除しました！", { duration: 2000 });
    closeAlert();
    closeDialog();
    refreshTable();
  };

  return (
    <div
      role="alert"
      className="alert-with-buttons alert fixed z-50 bottom-1 sm:right-2 sm:w-fit sm:-mt-4 bg-slate-200"
    >
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="whitespace-nowrap">削除しますか？</span>
      </>
      <div className="flex justify-between w-1/2">
        <button
          onClick={handleDeny}
          className="btn btn-sm btn-neutral tracking-tighter sm:-ml-1.5 sm:mr-1.5"
        >
          ううん
        </button>
        <button
          onClick={handleAccept}
          className="btn btn-sm btn-primary tracking-wider"
        >
          &nbsp;うん&nbsp;
        </button>
      </div>
    </div>
  );
};

export default AlertWithButtons;
