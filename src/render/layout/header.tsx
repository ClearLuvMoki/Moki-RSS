import SettingModal from "@/components/setting-modal";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { RotateCw } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "../store";

const Header = () => {
  const { t } = useTranslation();
  const { feedList, addFeed } = useGlobalStore();
  const [loading, setLoading] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    Promise.allSettled(
      feedList
        ?.filter((item) => item?.feedUrl)
        .map((item) => {
          return addFeed(item?.feedUrl);
        }),
    ).finally(() => {
      addToast({
        title: t("toast.success.reload"),
        color: "success",
      });
      setLoading(false);
    });
  }, [addFeed, feedList, t]);

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
        <Button
          color="default"
          variant="light"
          size="md"
          className="min-w-1"
          isLoading={loading}
          onPress={reload}
          isIconOnly
        >
          <RotateCw size={18} />
        </Button>
        <SettingModal />
      </div>
    </div>
  );
};

export default Header;
