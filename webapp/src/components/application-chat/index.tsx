import {ReactElement, useEffect, useRef, useState} from "react";
import {useChat} from "../../hooks/applications.ts";
import {Field, Fieldset, Input} from "@headlessui/react";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";
import ChatHistory from "../chat-history";
import Loading from "../../assets/images/loading.svg?react";

interface ApplicationChatProps {
    applicationId: string;
}

const ApplicationChat = (props: ApplicationChatProps): ReactElement => {
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { data: chatMessages, sendMessage, loading } = useChat(props.applicationId);

    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth"
        });
    }, [chatMessages])

    return (
        <>
            <ChatHistory chats={chatMessages ?? []} />
            <form
                className="sticky bottom-0 bg-slate-800 pb-6 -mb-6 pt-6 mt-6 border-t border-white/10"
                onSubmit={async (event) => {
                    event.preventDefault();
                    setFormError(undefined);

                    if (!textAreaRef?.current?.value || textAreaRef?.current?.value?.length === 0) {
                        setFormError("A message is required.")
                    } else {
                        await sendMessage({ message: textAreaRef.current.value })
                        textAreaRef.current.value = "";
                    }
                }}
            >
                <Fieldset>
                    <Field>
                        <Input
                            type="text"
                            ref={textAreaRef}
                            placeholder="Place your message here..."
                        />
                    </Field>
                </Fieldset>
                <div className="flex items-center mt-6">
                    {formError ? (
                        <p className="text-lg font-medium text-red-500">{formError}</p>
                    ) : undefined}
                    <button
                        className="space-x-2 ml-auto"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span>Generating Response</span>
                                <Loading className="w-4 h-4 fill-white animate-spin"/>
                            </>
                        ) : (
                            <>
                                <span>Send Message</span>
                                <PaperAirplaneIcon className="w-4 h-4 text-current"/>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}

export default ApplicationChat;