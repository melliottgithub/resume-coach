import {ReactElement, useRef, useState} from "react";
import {Field, Fieldset, Label, Textarea} from "@headlessui/react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import FileUpload, { UploadedFile } from "../file-upload";

interface CreateApplicationFormProps {
    onSubmit: (text?: string, file?: string) => void;
}

const CreateApplicationForm = (props: CreateApplicationFormProps): ReactElement => {
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>(undefined);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                if (uploadedFile) {
                    props.onSubmit(undefined, uploadedFile.data)
                } else {
                    if (textAreaRef.current) {
                        props.onSubmit(textAreaRef.current.value, undefined)
                    }
                }
            }}
        >
            <Fieldset>
                <Field>
                    <Label className="mb-4">
                        Paste your CV:
                    </Label>
                    <Textarea
                        ref={textAreaRef}
                        className="min-h-[250px]"
                        placeholder="Place the content of your CV here..."
                    />
                </Field>
                <Field>
                    <Label className="mt-5 mb-4">
                        Or upload your CV:
                    </Label>
                    <FileUpload
                        hint={uploadedFile ? `Uploaded: ${uploadedFile?.file}`: "Drag 'n' drop a PDF file here, or click to select one"}
                        onSubmit={setUploadedFile}
                    />
                </Field>
            </Fieldset>
            <button
                className="space-x-2 ml-auto mt-4"
                type="submit"
            >
                <span>Analyze</span>
                <MagnifyingGlassIcon className="w-4 h-4 text-current"/>
            </button>
        </form>
    )
}

export default CreateApplicationForm;