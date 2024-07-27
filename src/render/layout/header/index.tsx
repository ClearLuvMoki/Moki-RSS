import {Fragment, memo} from 'react';
import deepEqual from "deep-equal";
import {useSetState} from "ahooks";
import {toast} from "sonner";
import {RotateCw, SlidersHorizontal} from "lucide-react";
import {observer} from "mobx-react";
import SettingModal from "@render/components/SettingModal";
import RSSDetailModal from "@render/components/RSSDetailModal";
import IconWrapper from "@render/components/IconWrapper";
import {RIPCUpdateFeedList} from "@render/ripc";
import Store from "@render/store";
import GroupModal from "@render/components/GroupModal";
import Search from "@render/components/Search";
import {Tooltip} from "@nextui-org/react";
import {useTranslation} from "react-i18next";


const Header = memo(observer(() => {
    const {handleGetFeedList, groupModalState, updateGroupModalState} = Store;
    const {t} = useTranslation()
    const [settingState, setSettingState] = useSetState({
        open: false,
        loading: false
    })

    const handleUpdateFeed = () => {
        setSettingState({loading: true})
        RIPCUpdateFeedList()
            .then(() => {
                handleGetFeedList();
                toast.success(t("toast.success.reload"))
            })
            .catch(() => {
                toast.error(t("toast.failed.reload"))
            })
            .finally(() => {
                setSettingState({loading: false})
            })
    }

    return (
        <Fragment>
            <SettingModal
                open={settingState.open}
                onClose={() => {
                    setSettingState({
                        open: false
                    })
                }}
            />
            <GroupModal
                open={groupModalState?.open}
                groupItem={groupModalState?.groupItem}
                onClose={() => {
                    updateGroupModalState({
                        open: false,
                        groupItem: null
                    });
                }}
            />
            <RSSDetailModal/>
            <div
                className="h-[50px] w-full border-b border-b-gray-200 flex justify-end items-center px-4"
                style={{
                    // @ts-ignore
                    WebkitAppRegion: "drag"
                }}
            >
                <Search/>

                <div
                    className="flex items-center gap-2"
                    style={{
                        // @ts-ignore
                        WebkitAppRegion: "no-drag"
                    }}
                >
                    <Tooltip showArrow={true} content={t("action.reload")} color="foreground" closeDelay={0} placement="bottom">
                        <IconWrapper
                            onClick={() => {
                                if (settingState?.loading) return;
                                handleUpdateFeed()
                            }}
                        >
                            <RotateCw
                                size={18}
                                className={settingState?.loading ? "animate-spin cursor-not-allowed" : ""}
                            />
                        </IconWrapper>
                    </Tooltip>
                    <Tooltip showArrow={true} content={t("action.setting")} color="foreground" closeDelay={0} placement="bottom">
                        <IconWrapper
                            onClick={() => {
                                setSettingState({
                                    open: true
                                })
                            }}
                        >
                            <SlidersHorizontal
                                size={18}
                            />
                        </IconWrapper>
                    </Tooltip>

                </div>
            </div>
        </Fragment>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default Header;
