import SettingModal from "@/components/setting-modal";
import { Button } from "@heroui/button";
import { RotateCw } from "lucide-react";

const Header = () => {
  return (
    <div
      className="h-[50px] w-full border-b flex justify-end items-center px-4 light:border-b-gray-200 dark:border-b-gray-600"
      style={{
        // @ts-ignore
        WebkitAppRegion: "drag",
      }}
    >
      <div
        className="flex items-center gap-2"
        style={{
          // @ts-ignore
          WebkitAppRegion: "no-drag",
        }}
      >
        <Button color="default" variant="light" size="md" className="min-w-1">
          <RotateCw size={18} />
        </Button>
        <SettingModal />
      </div>
    </div>
  );
};

export default Header;
