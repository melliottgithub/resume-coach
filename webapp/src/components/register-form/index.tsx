import {ReactElement, useRef, useState} from "react";
import {Field, Fieldset, Input, Label} from "@headlessui/react";
import {UserIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import {NavLink} from "react-router-dom";
import Config from "../../config.ts";

interface LoginFormProps {
    onSubmit: (email: string, password: string, name: string) => void;
    error?: string;
    success?: boolean;
}

const LoginForm = (props: LoginFormProps): ReactElement => {
    const [error, setError] = useState<string | undefined>();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();

                const email = emailRef?.current?.value;
                const password = passwordRef?.current?.value;
                const name = nameRef?.current?.value;

                if (email && password && name) {
                    props.onSubmit(email, password, name)
                } else {
                    setError("Email, password and name is required.")
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
                <Field>
                    <Label>Name:</Label>
                    <Input type="text" ref={nameRef} placeholder="Your name..." />
                </Field>
                <div className="flex items-center justify-between space-x-6">
                    <NavLink
                        to={Config.LINKS.LOGIN}
                        className="flex items-center space-x-2 text-slate-400 hover:text-white transition duration-200 ease-in-out"
                    >
                        <UserIcon className="w-5 h-5"/>
                        <span>Already have an account?</span>
                    </NavLink>
                    <button
                        type="submit"
                        className="space-x-2"
                    >
                        <span>Register</span>
                        <UserPlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </Fieldset>
            {error || props.error ? (
                <p className="text-lg font-medium text-red-500 mt-8">{error || props.error}</p>
            ) : undefined}
            {error || props.success ? (
                <p className="text-lg font-medium text-green-500 mt-8">Registration complete. You may now login with your new account.</p>
            ) : undefined}
        </form>
    )
}

export default LoginForm;