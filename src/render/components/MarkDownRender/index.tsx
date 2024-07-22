import {memo} from 'react';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import deepEqual from "deep-equal";

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


const MarkDownRender = memo(({content}: Props) => {
    const _content = removeHtmlIndentation(content)
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
                    return <a {...props} className="text-blue-600 cursor-pointer"/>
                },
                img(props) {
                    return <img {...props} className="w-[500px] h-auto my-4" loading="lazy"/>
                },
            }}
        >{_content}</Markdown>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default MarkDownRender;
