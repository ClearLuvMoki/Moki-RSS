import {memo} from 'react';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import deepEqual from "deep-equal";
import {RIPCCopy, RIPCOpenUrl, RIPCSaveBase64Image} from "@render/ripc";
import ContextMenu, {ActionValueType} from "@render/components/ContextMenu";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";

interface Props {
    content: string;
}

const removeHtmlIndentation = (htmlString: string) => {
    const lines = htmlString.split('\n');
    const cleanedLines = lines.map((line: string) => {
        if (line.trim().startsWith('<')) {
            return line.replace(/^\s+/, '');
        }
        return line;
    });
    return cleanedLines.join('\n');
}

const handleUrlToBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                resolve(reader.result as any);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting URL to Base64:', error);
        throw error;
    }
}


const MarkDownRender = memo(({content}: Props) => {
    const _content = removeHtmlIndentation(content)
    const {t} = useTranslation()

    const handleLinkAction = (type: ActionValueType, url?: string) => {
        switch (type) {
            case "open-link": {
                return RIPCOpenUrl(url || "")
            }
            case "copy-link": {
                return RIPCCopy("text", url || "")
                    .then(() => {
                        toast.success(t("toast.success.copy"))
                    })
                    .catch(() => {
                        toast.error(t("toast.failed.copy"))
                    })
            }
            default: {
                return
            }
        }
    }

    const handleImageAction = (type: ActionValueType, url?: string) => {
        switch (type) {
            case "open-link": {
                return RIPCOpenUrl(url || "")
            }
            case "copy-link": {
                return RIPCCopy("text", url || "")
                    .then(() => {
                        toast.success(t("toast.success.copy"))
                    })
            }
            case "copy-image": {
                if (url && url?.startsWith("http")) {
                    handleUrlToBase64(url)
                        .then((base) => {
                            console.log(base, 'base')
                            RIPCCopy("image", base || "")
                                .then(() => {
                                    toast.success(t("toast.success.copy"))
                                })
                        })
                    return;
                } else {
                    RIPCCopy("text", url || "")
                        .then(() => {
                            toast.success(t("toast.success.copy"))
                        })
                    return
                }
            }
            case "save-image": {
                if (url && url?.startsWith("http")) {
                    handleUrlToBase64(url)
                        .then((base) => {
                            RIPCSaveBase64Image(base || "")
                                .then((res) => {
                                    toast.success(t(`toast.success.save`, {path: res}))
                                })
                        })
                    return
                } else {
                    RIPCSaveBase64Image(url || "")
                        .then((res) => {
                            toast.success(t(`toast.success.save`, {path: res}))
                        })
                    return
                }
            }
            default: {
                return
            }
        }
    }

    return (
        <Markdown
            remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
            rehypePlugins={[rehypeRaw]}
            urlTransform={(url) => {
                return url
            }}
            components={{
                h1(props) {
                    const {children} = props;
                    return <h1 className="text-2xl">{children}</h1>
                },
                div(props) {
                    return <div {...props} className={(props?.className || "") + " my-2"}/>
                },
                p(props) {
                    return <p {...props} className={(props?.className || "") + " my-2"}/>
                },
                a(props) {
                    return <ContextMenu
                        type={"link"}
                        onAction={(type) => {
                            handleLinkAction(type, props?.href)
                        }}
                        trigger={<span
                            className="text-blue-600 cursor-pointer"
                            onClick={() => {
                                if (props?.href) {
                                    RIPCOpenUrl(props?.href)
                                }
                            }}
                        >{props?.children}</span>}
                    />
                },
                img(props) {
                    return <ContextMenu
                        type={"image"}
                        onAction={(type) => {
                            handleImageAction(type, props?.src || props?.srcSet)
                        }}
                        trigger={<img {...props} className="w-[500px] h-auto my-4" loading="lazy"/>}
                    />

                },
            }}
        >{_content}</Markdown>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default MarkDownRender;
