import {ReactElement} from "react";
import {Job} from "../../hooks/jobs.ts";
import {ArrowRightEndOnRectangleIcon, BuildingOfficeIcon} from "@heroicons/react/24/outline";
import dayjs from "dayjs";

interface JobPreviewProps {
    job: Job;
}

const JobPreview = ({ job }: JobPreviewProps): ReactElement => {
    return (
        <>
            <header className="mb-8 sticky top-8">
                <div className="flex items-center space-x-4">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center
                            text-white bg-indigo-700 shadow-lg"
                    >
                        <BuildingOfficeIcon className="w-5 h-5"/>
                    </div>
                    <p
                        className="tracking-wider uppercase font-medium text-sm text-slate-200
                            truncate"
                    >
                        {job.company}
                    </p>
                </div>
                <h2 className="text-indigo-500 font-bold text-2xl mt-6">
                    Your application to:
                </h2>
                <h1 className="text-white font-bold mt-3.5 text-4xl">
                    {job.job_title}
                </h1>
                <p className="text-slate-200 text-lg mt-3.5">
                    {job.address.location}, {job.address.country}
                </p>
                <p className="text-slate-400 text-xs tracking-wide uppercase truncate mt-1">
                    Posted: {dayjs(job.last_updated).fromNow()}
                </p>
                {job.apply_url ? (
                    <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener"
                        className="button block w-full justify-center mt-8 space-x-2"
                    >
                        <span>Apply on their site</span>
                        <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                    </a>
                ) : undefined}
            </header>
        </>
    )
}

export default JobPreview;