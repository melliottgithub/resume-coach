import {ReactElement} from "react";
import {ApplicationDetails} from "../../hooks/applications.ts";
import Markdown from "../markdown";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import {
    AcademicCapIcon,
    BriefcaseIcon,
    ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";
import {Job} from "../../hooks/jobs.ts";
import ApplicationChat from "../application-chat";

interface ApplicationDetailsProps {
    job?: Job
    application?: ApplicationDetails
}

const ApplicationDetailsComponent = (props: ApplicationDetailsProps): ReactElement => {
    const tabClassName = "p-0 flex items-center space-x-3 bg-transparent rounded-none text-xl pb-2 border-b-2 border-transparent" +
        " shadow-none hover:bg-transparent hover:shadow-none data-[selected]:border-indigo-500 hover:text-white data-[selected]:text-white text-slate-400 outline-0"
    return (
        <TabGroup>
            <TabList className="flex items-center space-x-10 mb-8">
                <Tab className={tabClassName}>
                    <AcademicCapIcon className="w-5 h-5"/>
                    <span>Coaching Report</span>
                </Tab>
                <Tab className={tabClassName}>
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5"/>
                    <span>Chat with Coach</span>
                </Tab>
                <Tab className={tabClassName}>
                    <BriefcaseIcon className="w-5 h-5"/>
                    <span>Job Description</span>
                </Tab>
            </TabList>
            <article className="w-full rounded-2xl bg-slate-800 shadow-2xl">
                <div className="h-full p-12">
                    <TabPanels>
                        <TabPanel>
                            {props.application ? (
                                <Markdown text={props.application.coaching_report?.content}/>
                            ) : undefined}
                        </TabPanel>
                        <TabPanel>
                            {props.application ? (
                                <ApplicationChat applicationId={props.application?.job_application.id} />
                            ) : undefined}
                        </TabPanel>
                        <TabPanel>
                            {props.application ? (
                                <Markdown text={props.job?.content}/>
                            ) : undefined}
                        </TabPanel>
                    </TabPanels>
                </div>
            </article>
        </TabGroup>
    )
}

export default ApplicationDetailsComponent;