import {ReactElement} from "react";
import Navigation from "../components/navigation";
import {useGetApplications} from "../hooks/applications.ts";
import LoadingWrapper from "../components/loading-wrapper";
import ApplicationCard from "../components/application-listing/application-card.tsx";
import Empty from "../components/empty";
import {NavLink} from "react-router-dom";
import Config from "../config.ts";
import {BriefcaseIcon} from "@heroicons/react/24/outline";

const ApplicationPage = (): ReactElement => {
    const { data: applications, isLoading } = useGetApplications();

    return (
        <LoadingWrapper isLoading={isLoading}>
            <div className="flex items-center justify-between px-6 pb-10">
                <Navigation/>
            </div>
            {applications && applications.length > 0 ? (
                <div className="grid grid-cols-12 gap-12 pb-6 px-6">
                    {applications?.map(application => {
                        return (
                            <div
                                key={application.id}
                                className="col-span-4"
                            >
                                <ApplicationCard application={application} />
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="px-6 flex flex-col items-center space-y-8 py-16">
                    <Empty
                        title="You have not applied to any jobs"
                        subtitle="Browse between thousands of offers!"
                    />
                    <NavLink
                        to={Config.LINKS.HOME}
                        className="button space-x-2 !inline-flex"
                    >
                        <span>See Available Jobs</span>
                        <BriefcaseIcon className="w-5 h-5" />
                    </NavLink>
                </div>
            )}
        </LoadingWrapper>
    )
}

export default ApplicationPage