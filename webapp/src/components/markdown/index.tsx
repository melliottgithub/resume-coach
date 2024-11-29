import {ReactElement} from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
    text?: string
    className?: string;
}

const Markdown = (props: MarkdownProps): ReactElement => {
    return (
        <ReactMarkdown
            className={"prose-li:my-0 prose prose-p:leading-normal prose-headings:mt-8 " +
                "prose-headings:mb-6 prose-slate prose-invert prose-lg prose-hr:mt-6 " +
                `prose-hr:mb-6 max-w-none${props.className ? ` ${props.className}` : ""}`}
        >
            {props.text}
        </ReactMarkdown>
    )
}

export default Markdown;