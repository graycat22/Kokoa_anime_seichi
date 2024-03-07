import Image from "next/image";
import Link from "next/link";

const TsukimoriLogo = () => {
  return (
    <footer className="w-content -mt-8 flex items-center justify-end">
      <div className="font-bold text-gray-600 flex items-center">
        <div className="text-xs text-center mr-1 pt-0.5">製作</div>
        <div className="text-sm mr-1">月守理工大学</div>
      </div>
      <div className="button-click-animation mr-16 lg:mr-40 flex cursor-pointer">
        <Link
          href="https://tsukimori-dialogue.onrender.com"
          className="w-full h-full"
        >
          <Image
            src="/TsukimoriUniversity.png"
            alt="Tuskimori University logo"
            width={22}
            height={22}
          />
        </Link>
      </div>
    </footer>
  );
};

export default TsukimoriLogo;
