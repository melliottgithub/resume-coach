import {ReactElement} from "react";
import {Job} from "../../hooks/jobs.ts";
import dayjs from "dayjs";

interface JobCardProps {
    job: Job;
    isActive: boolean;
    onClick: (jobId: string) => void;
}

const JobCard = (props: JobCardProps): ReactElement => {
    return (
        <>
            <hr className="first:hidden w-[calc(100%-3rem)] mx-auto border-white/10"/>
            <button
                className={"appearance-none text-left w-full block px-6 py-4 rounded-2xl group " +
                    (props.isActive ? "bg-slate-800 shadow-2xl hover:shadow-2xl hover:bg-slate-800"
                        : "bg-transparent hover:bg-slate-800 shadow-none hover:shadow-lg")}
                onClick={() => props.onClick(props.job.id)}
            >
                <h2
                    className={"font-bold text-lg transition-all duration-200 " +
                        (props.isActive ? "text-indigo-500" : "text-slate-200 group-hover:text-indigo-500")}
                >
                    {props.job.job_title}
                </h2>
                <p className="text-slate-400 font-medium text-md">
                    {props.job.company}
                </p>
                <div className="flex items-center justify-between mt-3 space-x-2 font-medium">
                    <p className="text-slate-400 text-xs tracking-wide uppercase truncate">
                        {props.job.address.city}, {props.job.address.country}
                    </p>
                    <p className="text-slate-400 text-xs tracking-wide uppercase">
                        {dayjs(props.job.last_updated).fromNow()}
                    </p>
                </div>
            </button>
        </>
    )
}

export default JobCard;