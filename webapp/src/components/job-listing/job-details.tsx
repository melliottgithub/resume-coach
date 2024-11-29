import dayjs from "dayjs";
import Empty from "../empty";
import {ReactElement, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeftIcon,
    ArrowRightEndOnRectangleIcon,
    BuildingOfficeIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {useJob} from "../../hooks/jobs.ts";
import LoadingWrapper from "../loading-wrapper";
import CreateApplicationForm from "../create-application-form";
import {useCreateApplication} from "../../hooks/applications.ts";
import Markdown from "../markdown";
import Config from "../../config.ts";

interface JobPageProps {
    jobId?: string;
}

const JobDetails = (props: JobPageProps): ReactElement => {
    const [showCVScreen, setShowCVScreen] = useState<boolean>(false);
    const navigate = useNavigate();

    const { isMutating, trigger: createNewApplication } = useCreateApplication();
    const { data: job, isLoading } = useJob(props.jobId);

    useEffect(() => {
        // Close CV screen after jobId change.
        setShowCVScreen(false)
    }, [props.jobId])

    const onSubmit = async (text?: string, file?: string) => {
        if (job) {
            const application = await createNewApplication({
                job_id: job?.id,
                resume_text: text,
                resume_file_base64: file,
            })
            if (application) {
                navigate(Config.LINKS.APPLICATION(application.id));
            }
        }
    }

    return (
        <div className="px-6 sticky top-6">
            <LoadingWrapper isLoading={isLoading || isMutating}>
                <article className="w-full rounded-2xl bg-slate-800 shadow-2xl h-[calc(100vh-3rem)] overflow-hidden">
                    <div className="overflow-auto h-full p-12">
                        {job ? (
                            <>
                                <div className="flex items-center justify-between space-x-6">
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
                                    <div className="flex items-center">
                                        {job.apply_url ? (
                                            <a
                                                href={job.apply_url}
                                                rel="noopener"
                                                target="_blank"
                                                className="text-slate-400 hover:text-slate-200 flex items-center mr-6 space-x-2"
                                            >
                                                <span>Apply on their site</span>
                                                <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                                            </a>
                                        ) : undefined}
                                        <button
                                            className="px-5 py-2.5 rounded-2xl bg-indigo-700 hover:bg-indigo-500
                                            font-bold text-white text-base flex items-center space-x-2 shadow-lg
                                            hover:shadow-xl appearance-none"
                                            onClick={() => setShowCVScreen(prevState => !prevState)}
                                        >
                                            {showCVScreen ? <ArrowLeftIcon className="w-4 h-4 text-current"/> : undefined}
                                            <span>{showCVScreen ? "Back to Details" : "Analyze"}</span>
                                            {!showCVScreen ? <MagnifyingGlassIcon className="w-4 h-4 text-current"/> : undefined}
                                        </button>
                                    </div>
                                </div>
                                <header className="mt-8 border-b mb-8 pb-8 border-white/10">
                                    <div className="flex items-center justify-between mt-4 space-x-6">
                                        <p className="text-slate-400 text-xs tracking-wide uppercase truncate">
                                            {dayjs(job.last_updated).fromNow()}
                                        </p>
                                    </div>
                                    <h1 className="text-white font-bold mt-3.5 text-4xl">{job.job_title}</h1>
                                    <p className="text-slate-200 text-lg mt-2">
                                        {job.address.location}, {job.address.country}
                                    </p>
                                </header>
                                {showCVScreen && job ? (
                                    <CreateApplicationForm onSubmit={onSubmit} />
                                ) : (
                                    <Markdown text={job.content} />
                                )}
                            </>
                        ) : (
                            <Empty
                                title="Select a job to view its details"
                                subtitle="Choose between hundreds of jobs waiting for you!"
                            />
                        )}
                    </div>
                </article>
            </LoadingWrapper>
        </div>
    )
}

export default JobDetails;