import {ReactElement, useRef, useState} from "react";
import {Field, Fieldset, Input, Label} from "@headlessui/react";
import {ArrowRightIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import {NavLink} from "react-router-dom";
import Config from "../../config.ts";

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
    error?: string;
}

const LoginForm = (props: LoginFormProps): ReactElement => {
    const [error, setError] = useState<string | undefined>(undefined);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();

                const email = emailRef?.current?.value;
                const password = passwordRef?.current?.value;

                if (email && password) {
                    props.onSubmit(email, password)
                } else {
                    setError("Email and password is required.")
                }
            }}
        >
            <Fieldset className="space-y-8">
                <Field>
                    <Label>Email:</Label>
                    <Input type="text" ref={emailRef} placeholder="Your email..." />
                </Field>
                <Field>
                    <Label>Password:</Label>
                    <Input type="password" ref={passwordRef} placeholder="Your password..." />
                </Field>
                <div className="flex items-center justify-between space-x-6">
                    <NavLink
                        to={Config.LINKS.REGISTER}
                        className="flex items-center space-x-2 text-slate-400 hover:text-white transition duration-200 ease-in-out"
                    >
                        <UserPlusIcon className="w-5 h-5"/>
                        <span>Don't have an account yet?</span>
                    </NavLink>
                    <button
                        type="submit"
                        className="space-x-2"
                    >
                        <span>Login</span>
                        <ArrowRightIcon className="w-5 h-5"/>
                    </button>
                </div>
            </Fieldset>
            {props.error || error ? (
                <p className="text-lg font-medium text-red-500 mt-8">{props.error || error}</p>
            ) : undefined}
        </form>
    )
}

export default LoginForm;