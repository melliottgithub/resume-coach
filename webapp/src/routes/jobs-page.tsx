import {ReactElement, useEffect, useState} from "react";
import JobCard from "../components/job-listing/job-card.tsx";
import LoadingWrapper from "../components/loading-wrapper";
import JobDetails from "../components/job-listing/job-details.tsx";
import {useJobs} from "../hooks/jobs.ts";
import Navigation from "../components/navigation";
import {ArrowDownIcon} from "@heroicons/react/24/outline";
import Loading from "../assets/images/loading.svg?react";

const JobsPage = (): ReactElement  => {
    const [selectedJobId, setSelectedJobId] = useState<string | undefined>()
    const { data: jobs, isLoading, setSize } = useJobs();

    useEffect(() => {
        if (jobs && jobs.length > 0 && !selectedJobId) {
            setSelectedJobId(jobs[0].id)
        }
    }, [jobs, setSelectedJobId, selectedJobId])

    return (
        <LoadingWrapper isLoading={isLoading}>
            <div className="px-6 pb-10">
                <Navigation />
            </div>
            <div className="grid grid-cols-12 gap-12 pb-6">
                <div className="col-span-4 space-y-2">
                    {jobs?.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isActive={job.id === selectedJobId}
                            onClick={(jobId: string) => setSelectedJobId(jobId)}
                        />
                    ))}
                    <div className="px-6">
                        <button
                            disabled={isLoading}
                            className="space-x-2 w-full justify-center mt-4"
                            onClick={() => setSize(size => size + 1)}
                        >
                            <span>Load More</span>
                            {isLoading ?
                                <Loading className="w-4 h-4 fill-white animate-spin"/> :
                                <ArrowDownIcon className="w-4 h-4"/>
                            }
                        </button>
                    </div>
                </div>
                <div className="col-span-8">
                    <JobDetails jobId={selectedJobId}/>
                </div>
            </div>
        </LoadingWrapper>
    )
}

export default JobsPage;