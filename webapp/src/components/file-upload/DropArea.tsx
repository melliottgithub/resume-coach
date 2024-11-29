import { ReactElement, useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";

interface DropAreaProps {
    hint: string;
    onDrop: <T extends File>(files: T[]) => void
}

const DropArea = ({ hint, onDrop }: DropAreaProps): ReactElement => {
    const onDropAccepted = useCallback((acceptedFiles: File[]) => {
        onDrop(acceptedFiles);
    }, [onDrop]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] }  as unknown as Accept,
        onDrop: onDropAccepted,
    });

    return (
        <div {...getRootProps({ className: "dropzone" })}
        className="min-h-[96px] px-5 py-2.5 rounded-2xl flex items-center
        bg-slate-700 text-white shadow-lg hover:shadow-xl"
        >
            <input {...getInputProps()} />
            <p>{hint}</p>
        </div>
    );
};

export default DropArea;