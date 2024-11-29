import {ChatMessage} from "../../hooks/applications.ts";
import {ReactElement} from "react";
import Empty from "../empty";
import Markdown from "../markdown";
import {CodeBracketIcon, UserIcon} from "@heroicons/react/24/outline";

interface ChatHistoryProps {
    chats?: ChatMessage[]
}

const ChatHistory = ({ chats }: ChatHistoryProps): ReactElement => {
    return (
        <div className="space-y-6 mb-12 overflow-y-auto">
            {chats && chats.length > 0 ? chats.map((message, index) => {
                const wrapperClassName = message.messageType === "human" ? "ml-auto flex justify-end" : "";
                const bubbleClassName = message.messageType === "human" ? "bg-indigo-500" : "bg-slate-700";
                const userBallClassName = message.messageType === "human" ? "order-last ml-2" : "mr-2";
                return (
                    <div className={`max-w-[66.6666%] w-auto relative flex items-end ${wrapperClassName}`}>
                        <div
                            className={"w-12 h-12 rounded-full flex-shrink-0 shadow-xl flex items-center " +
                                `justify-center text-white ${bubbleClassName} ${userBallClassName}`}
                        >
                            {message.messageType === "human" ?
                                <UserIcon className="w-5 h-5" /> : <CodeBracketIcon className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-slate-400 font-medium mb-2">
                                {message.messageType === "human" ? "You" : "Coach"} said:
                            </p>
                            <div
                                key={`${message.messageType}-${index}`}
                                className={`rounded-2xl shadow-lg p-6 inline-block font-medium text-sm ${bubbleClassName}`}
                            >
                                <Markdown
                                    text={message.content}
                                    className="!prose-base !prose-headings:mt-6 !prose-headings:mb-4"
                                />
                            </div>
                        </div>
                    </div>
                )
            }) : (
                <Empty
                    title="Ask the Coach"
                    subtitle="Use the form below to get AI feedback!"
                />
            )}
        </div>
    )
}

export default ChatHistory;