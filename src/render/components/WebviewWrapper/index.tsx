import React, {memo, useEffect, useRef, useState} from 'react';
import deepEqual from "deep-equal";
import Empty from "@render/components/Empty";

interface Props {
    classNames?: {
        container?: string;
        webview?: string;
    }
    styles?: {
        container?: React.CSSProperties;
        webview?: React.CSSProperties;
    }
    src: string;
}

const WebviewWrapper = memo(({src, classNames, styles}: Props) => {
    const [renderErr, setRenderErr] = useState(false);
    const [_, setLoading] = useState(true);
    const ref = useRef<Electron.WebviewTag>(null)


    useEffect(() => {
        const webview = ref.current;
        if (!webview) return void 0;
        webview.addEventListener("did-stop-loading", handleStopLoading);
        webview.addEventListener("did-fail-load", handleFailLoad)
        return () => {
            webview.removeEventListener("did-stop-loading", handleStopLoading)
            webview.addEventListener("did-fail-load", handleFailLoad)
        }
    }, [ref.current])

    const handleStopLoading = () => {
        setLoading(false)
    }

    const handleFailLoad = () => {
        setRenderErr(true)
    }

    if (renderErr) {
        return (
            <div
                className={"w-full h-full flex items-center justify-center"}
            >
                <Empty
                />
            </div>

        )
    }

    return (
        <div
            className={"w-full h-full " + (classNames?.container || "")}
            style={styles?.container || {}}
        >
            <webview
                ref={ref}
                src={src}
                className={"z-4 " + (classNames?.webview || "")}
                style={styles?.webview || {}}
            />
        </div>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default WebviewWrapper;
