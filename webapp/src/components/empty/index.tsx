import {ReactElement} from "react";

interface EmptyProps {
    title: string;
    subtitle: string;
}

const Empty = (props: EmptyProps): ReactElement => (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <h2 className="text-slate-200 font-bold text-4xl">
            {props.title}
        </h2>
        <p className="text-slate-400 mt-2 text-xl">
            {props.subtitle}
        </p>
    </div>
)

export default Empty