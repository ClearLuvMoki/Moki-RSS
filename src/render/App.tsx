import Layout from "./layout";
import Magazine from "@render/components/Magazine";
import {observer} from "mobx-react";
import {useEffect, useMemo} from "react";
import {RIPCListenerThemeUpdate, RIPCOSConfig} from "@render/ripc";
import Store from "@render/store";
import i18n from "./i18n";
import Empty from "@render/components/Empty";
import {useTheme} from "next-themes";
import {Toaster} from "sonner";
import Compact from "@render/components/Compact";
import {DefaultValue} from "@src/types/os";

const {Header, SideBar} = Layout

const App = observer(() => {
    const {theme, setTheme} = useTheme();
    const {
        OSConfig,
        updateOSConfig,
        rssList,
        rssListLoading,
        handleGetFeedList,
        handleGetGroupList
    } = Store;

    useEffect(() => {
        RIPCListenerThemeUpdate((_, {type}) => {
            setTheme(type)
        })
        RIPCOSConfig()
            .then((res) => {
                updateOSConfig(res, true);
                handleGetFeedList();
                handleGetGroupList();
                if (res?.locale) {
                    i18n.changeLanguage(res.locale || DefaultValue.lang)
                }
            })
    }, [])

    const $list = useMemo(() => {
        switch (OSConfig?.listMode) {
            case  "magazine": {
                return <Magazine/>
            }
            case "compact": {
                return <Compact/>
            }
            default: {
                return <Magazine/>
            }
        }
    }, [OSConfig?.listMode])

    return (
        <div className={"w-full h-full overflow-hidden"}>
            <Toaster
                duration={3000}
                visibleToasts={10}
                position="top-right"
                theme={theme as any || "light"}
            />
            <Header/>
            <div className={"w-full h-[calc(100%-50px)] overflow-hidden flex flex-nowrap"}>
                <SideBar/>
                <div className={"w-[calc(100%-240px)] h-full overflow-hidden"}>
                    {rssList.length === 0 && !rssListLoading && (
                        <div className="flex justify-center items-center h-full"><Empty/></div>)}
                    {(rssList.length > 0 || rssListLoading) && ($list)}
                </div>
            </div>
        </div>
    );
});

export default App;
