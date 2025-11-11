import Channels from "@/domains/channel";
import type { GroupType } from "@/domains/types/group";
import Inject from "@/render/inject";
import { useGlobalStore } from "@/render/store";
import { Button } from "@heroui/button";
import { Input, Select, SelectItem, Tab, Tabs, Textarea, addToast } from "@heroui/react";
import { useSetState } from "ahooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  group?: GroupType | null;
  onClean?: () => void;
}
const ManagerGroup = ({ group, onClean }: Props) => {
  const { t } = useTranslation();
  const { feedList, reloadFeed, reloadGroup } = useGlobalStore();
  const [formState, setFormState] = useSetState<{
    name: string;
    feeds: string[];
    description: string;
  }>({
    name: "",
    feeds: [],
    description: "",
  });
  const [formErr, setFormErr] = useSetState({
    nameErr: "",
  });

  const isEdit = useMemo(() => Boolean(group?.id), [group?.id]);

  useEffect(() => {
    if (group) {
      setFormState({
        name: group?.name || "",
        feeds: group?.feeds?.map((item) => item?.id) || [],
        description: group?.description || "",
      });
    }
  }, [group, setFormState]);

  const onSubmit = useCallback(() => {
    if (!formState.name) {
      return setFormErr({
        nameErr: "请输入分组名称!",
      });
    }
    console.log(formState, "formState");
    return Inject.invoke(Channels.CreateOrUpdateGroup, {
      group: {
        ...formState,
        id: group?.id || "",
      },
    })
      .then(() => {
        onCancel();
        addToast({
          title: t("toast.success.index"),
          color: "success",
        });
      })
      .catch(() => {
        addToast({
          title: t("toast.failed.index"),
          color: "danger",
        });
      });
  }, [formState, setFormErr, group, t]);

  const onCancel = useCallback(() => {
    setFormErr({
      nameErr: "",
    });
    setFormState({
      name: "",
      feeds: [],
      description: "",
    });
    reloadFeed();
    reloadGroup();
    onClean?.();
  }, [setFormErr, setFormState, reloadFeed, reloadGroup, onClean]);

  const $value = useMemo(() => {
    return new Set(formState?.feeds);
  }, [formState?.feeds]);

  console.log(feedList, "feedList");

  return (
    <div>
      <Input
        type="name"
        name="name"
        label={t("group.name")}
        isRequired
        isInvalid={Boolean(formErr.nameErr)}
        errorMessage={formErr.nameErr}
        placeholder={t("group.name-placeholder")}
        value={formState?.name}
        onValueChange={(value) => {
          setFormState({ name: value });
        }}
      />
      <Select
        name="feeds"
        className="py-2"
        label={t("feed.index")}
        placeholder={t("feed.index")}
        selectionMode="multiple"
        selectedKeys={$value}
        onSelectionChange={(keys: any) => {
          setFormState({
            feeds: Array.from(keys) || [],
          });
        }}
      >
        {feedList
          .filter((item) =>
            isEdit ? !item?.groupId || item?.groupId === group?.id : !item?.groupId,
          )
          .map((item) => (
            <SelectItem key={item.id}>{item?.title}</SelectItem>
          ))}
      </Select>
      <Textarea
        name="description"
        label={t("group.index")}
        placeholder={t("group.desc")}
        value={formState?.description}
        errorMessage={t("group.desc-placeholder")}
        onValueChange={(value) => {
          setFormState({
            description: value,
          });
        }}
      />
      <div className="w-full flex justify-end gap-4 my-4">
        <Button variant="shadow" onPress={onCancel}>
          {t("action.clean")}
        </Button>
        <Button variant="shadow" color="primary" onPress={onSubmit}>
          {t("action.submit")}
        </Button>
      </div>
    </div>
  );
};

const GroupContent = () => {
  const { t } = useTranslation();
  const { groupList, reloadGroup, reloadFeed } = useGlobalStore();
  const [selectGroup, setSelectGroup] = useState<GroupType | null>(null);
  const [loading, setLoading] = useState(false);

  const $value = useMemo(() => {
    return new Set(selectGroup?.id ? [selectGroup?.id] : []);
  }, [selectGroup]);

  const onDelete = useCallback(() => {
    setLoading(true);
    Inject.invoke(Channels.DeleteGroup, {
      id: selectGroup?.id,
      feedIds: selectGroup?.feeds?.map((item) => item?.id) || [],
    })
      .then(() => {
        reloadGroup();
        reloadFeed();
        setSelectGroup(null);
        addToast({
          title: t("toast.success.index"),
          color: "success",
        });
      })
      .catch(() => {
        addToast({
          title: t("toast.failed.index"),
          color: "danger",
        });
      })
      .finally(() => setLoading(false));
  }, [selectGroup, t, reloadGroup, reloadFeed]);

  return (
    <div className="py-2">
      <h2 className="text-lg text-gray-700 font-semibold select-none mb-4 dark:text-gray-200">
        {t("group.index")}
      </h2>
      <Tabs
        variant="underlined"
        style={{
          transform: "translateX(-10px)",
        }}
      >
        <Tab key="create" title={t("group.create")}>
          <ManagerGroup />
        </Tab>
        <Tab key="update" title={t("group.update")}>
          <div className="flex gap-2 items-center py-2">
            <Select
              size="sm"
              className="max-w-sm"
              label={t("group.name")}
              placeholder={t("group.name")}
              selectedKeys={$value}
              onSelectionChange={(key) => {
                const group = groupList.find((item) => item?.id === Array.from(key)?.[0]);
                if (group) {
                  console.log(group, "ggg");
                  setSelectGroup(group);
                }
              }}
            >
              {groupList.map((item) => (
                <SelectItem key={item.id}>{item?.name}</SelectItem>
              ))}
            </Select>
            <Button
              color={"danger"}
              isDisabled={!selectGroup}
              onPress={onDelete}
              isLoading={loading}
            >
              {t("action.delete")}
            </Button>
          </div>
          {selectGroup && <ManagerGroup group={selectGroup} onClean={() => setSelectGroup(null)} />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default GroupContent;
