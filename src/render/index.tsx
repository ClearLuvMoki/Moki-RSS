import "./index.css"
import "./i18n";
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "mobx-react"
import { Toaster } from 'sonner'
import Store from "@render/store";
import {NextUIProvider} from "@nextui-org/react";


const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <NextUIProvider>
        <Provider store={Store}>
            <Toaster duration={3000} visibleToasts={10} position="top-right"/>
            <App/>
        </Provider>
    </NextUIProvider>
);
