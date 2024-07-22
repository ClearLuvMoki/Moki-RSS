import Layout from "./layout";
import Magazine from "@render/components/Magazine";
import {observer} from "mobx-react";

const {Header, SideBar} = Layout

const App = observer(() => {

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
