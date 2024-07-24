import {Fragment, memo} from 'react';
import deepEqual from "deep-equal";
import SettingModal from "@render/components/SettingModal";
import {RotateCw, SlidersHorizontal} from "lucide-react";
import RSSDetailModal from "@render/components/RSSDetailModal";
import IconWrapper from "@render/components/IconWrapper";
import {RIPCUpdateFeedList} from "@render/ripc";
import Store from "@render/store";
import {useSetState} from "ahooks";
import {toast} from "sonner";
import GroupModal from "@render/components/GroupModal";
import {observer} from "mobx-react";

const Header = memo(observer(() => {
    const {handleGetFeedList, groupModalState, updateGroupModalState} = Store;
    const [settingState, setSettingState] = useSetState({
        open: false,
        loading: false
    })

    const handleUpdateFeed = () => {
        setSettingState({loading: true})
        RIPCUpdateFeedList()
            .then(() => {
                handleGetFeedList();
                toast.success("同步成功!")
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

                <div
                    className="flex items-center gap-2"
                    style={{
                        // @ts-ignore
                        WebkitAppRegion: "no-drag"
                    }}
                >
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

                </div>
            </div>
        </Fragment>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default Header;
