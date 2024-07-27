import Layout from "./layout";
import Magazine from "@render/components/Magazine";
import {observer} from "mobx-react";
import {useEffect} from "react";
import {RIPCOSConfig} from "@render/ripc";
import Store from "@render/store";
import i18n, {DefaultLang} from "./i18n";

const {Header, SideBar} = Layout

const App = observer(() => {
    const {updateOSConfig} = Store;

    useEffect(() => {
        RIPCOSConfig()
            .then((res) => {
                updateOSConfig(res, true)
                if (res?.locale) {
                    i18n.changeLanguage(res.locale || DefaultLang)
                }
            })
    }, [])

    return (
        <div className={"w-full h-full overflow-hidden"}>
            <Header/>
            <div className={"w-full h-[calc(100%-50px)] overflow-hidden flex flex-nowrap"}>
                <SideBar/>
                <div className={"w-[calc(100%-240px)] h-full overflow-hidden"}>
                    <Magazine/>
                </div>
            </div>
        </div>
    );
});

export default App;
