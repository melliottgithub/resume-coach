import {ReactElement} from "react";
import {BriefcaseIcon} from "@heroicons/react/24/outline";
import LoadingWrapper from "../components/loading-wrapper";
import RegisterForm from "../components/register-form";
import {useRegister} from "../hooks/register.ts";

const RegisterPage = (): ReactElement => {
    const { data, register, isLoading, error } = useRegister();

    const onSubmit = async (email: string, password: string, name: string) => {
        await register({ email, password, name });
    }

    const registerSucceeded = !isLoading && !!data && !error;

    return (
        <main className="h-screen w-full">
            <div className="flex flex-col h-full items-center justify-center">
                <section className="space-y-6">
                    <h1 className="text-white text-3xl font-bold">Register</h1>
                    <LoadingWrapper isLoading={isLoading}>
                        <div
                            className="grid grid-cols-12 gap-12 w-[980px] rounded-2xl shadow-2xl bg-slate-800 overflow-hidden">
                            <div className="col-span-7">
                                <div className="p-12">
                                    <RegisterForm
                                        onSubmit={onSubmit}
                                        error={error?.message}
                                        success={registerSucceeded}
                                    />
                                </div>
                            </div>
                            <div className="col-span-5">
                                <div
                                    className="w-full h-full bg-gradient-to-b px-8 py-12 from-indigo-600 to-indigo-800
                                     flex flex-col justify-end"
                                >
                                    <BriefcaseIcon className="w-12 h-12 mb-8 text-white"/>
                                    <h2 className="text-2xl font-bold text-white">
                                        Get useful insights for your CV tailored for the job you want, powered by AI
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </LoadingWrapper>
                </section>
            </div>
        </main>
    )
}

export default RegisterPage;