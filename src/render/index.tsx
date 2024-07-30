import "./index.css"
import "./i18n";
import ReactDOM from 'react-dom/client';
import {Provider} from "mobx-react"
import App from './App';
import Store from "@render/store";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
            <Provider store={Store}>
                <App/>
            </Provider>
        </NextThemesProvider>
    </NextUIProvider>
);
