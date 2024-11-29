import {ReactElement} from "react";
import Navigation from "../components/navigation";
import LoadingWrapper from "../components/loading-wrapper";
import {useGetApplication} from "../hooks/applications.ts";
import {useParams} from "react-router-dom";
import ApplicationDetails from "../components/application-details";
import {useJob} from "../hooks/jobs.ts";
import JobPreview from "../components/job-listing/job-preview.tsx";

const ApplicationDetailsPage = (): ReactElement => {
    const { applicationId } = useParams();
    const { data: application, isLoading: applicationIsLoading } = useGetApplication(applicationId)
    const { data: job, isLoading: jobIsLoading } = useJob(application?.job_application.job_id)

    return (
        <LoadingWrapper isLoading={applicationIsLoading || jobIsLoading}>
            <div className="flex items-center justify-between px-6 pb-10">
                <Navigation/>
            </div>
            <div className="grid grid-cols-12 gap-12 pb-6 px-6">
                <div className="col-span-3">
                    {job ? <JobPreview job={job} /> : undefined}
                </div>
                <div className="col-span-9">
                    <ApplicationDetails application={application} job={job} />
                </div>
            </div>
        </LoadingWrapper>
    )
}

export default ApplicationDetailsPage;