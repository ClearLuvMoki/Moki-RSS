import Channels from "@/domains/channel";
import Inject from "@/render/inject";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-interface";

interface Props {
  content: string;
}

const removeHtmlIndentation = (htmlString: string) => {
  const lines = htmlString.split("\n");
  const cleanedLines = lines.map((line: string) => {
    if (line.trim().startsWith("<")) {
      return line.replace(/^\s+/, "");
    }
    return line;
  });
  return cleanedLines.join("\n");
};

const MarkdownRender = ({ content }: Props) => {
  const _content = removeHtmlIndentation(content);
  // const { t } = useTranslation();

  return (
    <Markdown
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      rehypePlugins={[rehypeRaw]}
      urlTransform={(url) => {
        return url;
      }}
      components={{
        h1(props) {
          const { children } = props;
          return <h1 className="text-2xl">{children}</h1>;
        },
        div(props) {
          return <div {...props} className={`${props?.className || ""} my-2`} />;
        },
        p(props) {
          return <p {...props} className={`${props?.className || ""} my-2`} />;
        },
        img(props) {
          return <img {...props} alt="assets" className="w-[500px] h-auto my-4" loading="lazy" />;
        },
        a(props) {
          return (
            <span
              {...props}
              className="underline text-blue-400 cursor-pointer"
              onClick={() => {
                if (props?.href) {
                  Inject.invoke(Channels.OpenLocalBrowser, { url: props?.href });
                }
              }}
            />
          );
        },
        code(props) {
          return <CodeBlock code={(props?.children as string) || ""} />;
        },
      }}
    >
      {_content}
    </Markdown>
  );
};

export default MarkdownRender;
