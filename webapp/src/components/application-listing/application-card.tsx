import {ReactElement} from "react";
import {Link} from "react-router-dom";
import {Application} from "../../hooks/applications.ts";
import Config from "../../config.ts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc, { parseToLocal: true });

interface ApplicationCardProps {
    application: Application
}

const ApplicationCard = ({
    application
}: ApplicationCardProps): ReactElement => {
    return (
        <Link
            to={Config.LINKS.APPLICATION(application.id)}
            className="p-8 rounded-2xl bg-slate-800 block group shadow-lg hover:shadow-2xl"
        >
            <div className="px-3 py-1 font-bold uppercase text-sm bg-indigo-700 rounded-2xl inline-block text-white">
                {application.status}
            </div>
            <h2 className="font-bold text-lg transition-all duration-200 text-slate-200 group-hover:text-indigo-500 mt-6">
                {application.title || "Untitled Application"}
            </h2>
            <p className="text-slate-400 text-xs font-medium tracking-wide uppercase mt-2">
                {dayjs.utc(application.created_at).local().fromNow()}
            </p>
        </Link>
    )
}

export default ApplicationCard;