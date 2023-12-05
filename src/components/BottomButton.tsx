import Link from "next/link";
import MeccaModal from "./Admin-UI/MeccaModal";

const BottomButton = ({
  deleteCheckedMecca,
  triggerTableReverse,
  onSort,
}: {
  deleteCheckedMecca: () => void;
  triggerTableReverse: () => void;
  onSort: () => void;
}) => {
  // ソートボタンを押して親から渡された関数を実行する
  const clickToSort = () => {
    onSort();
  };

  return (
    <div className="btm-nav border-t-2 border-gray-100">
      <a
        onClick={deleteCheckedMecca}
        className="link link-neutral link-hover font-semibold mt-1.5 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="14"
          viewBox="0 0 448 512"
        >
          <path
            fill="#a386c6"
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
          />
        </svg>
      </a>
      <button>
        <Link href={"/"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-0.5 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
      </button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        className="w-1/3 h-2/5 flex items-center justify-center pl-3 cursor-pointer"
        onClick={clickToSort}
      >
        <path
          fill="#a386c6"
          d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"
        />
      </svg>

      <MeccaModal triggerTableReverse={triggerTableReverse} />
    </div>
  );
};

export default BottomButton;
