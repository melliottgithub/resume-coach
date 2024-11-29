import { ReactElement } from "react";
import DropArea from "./DropArea";

export interface UploadedFile {
    file: string;
    data: string;
}

interface FileUploadProps {
    hint: string;
    onSubmit: (file: UploadedFile) => void;
}

const FileUpload = (props: FileUploadProps): ReactElement => {
    const onDrop = async (acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(async (file) => ({
            file: file,
            data: await toBase64(new Blob([file as Blob])),
        }));

        const firstFile = await newFiles[0]
    
        props.onSubmit({
            file: firstFile.file.name,
            data: firstFile.data.indexOf(',') >= 0
                    ? firstFile.data.split(',')[1] : firstFile.data
        });
    };

    return (
        <>
        <DropArea hint={props.hint} onDrop={onDrop} />
        </>
    )
}


const toBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export default FileUpload;