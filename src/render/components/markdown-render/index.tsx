import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

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
  const { t } = useTranslation();

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
      }}
    >
      {_content}
    </Markdown>
  );
};

export default MarkdownRender;
