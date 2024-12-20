"use client";
import { useActionState } from "react";
import { signinAction } from "../actions";
import { Heading, Input, SubmitButton } from "@/ui/components";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { FormRedirect } from "./form-redirect";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signinAction, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded m-auto p-3 w-full max-w-md sm:p-8 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <div className="flex flex-col gap-2">
          <Heading title="Welcome Back!" />
          <form action={formAction}>
            <Input
              id="email"
              label="Email Address"
              name="email"
              type="text"
              disabled={isPending}
            />
            {state?.errors?.email && (
              <strong className="mt-1 text-sm text-red-600">
                {state.errors.email}
              </strong>
            )}
            <Input
              id="password"
              label="Password"
              name="password"
              type="password"
              disabled={isPending}
            />
            {state?.errors?.password && (
              <strong className="mt-1 text-sm text-red-600">
                {state.errors.password}
              </strong>
            )}
            <SubmitButton
              title="Log in"
              aria-disabled={isPending}
              pending={isPending}
            />
            {state && (
              <div
                className={`mt-4 flex items-center space-x-2 rounded-md p-3 text-sm ${
                  state.success
                    ? "bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-300"
                }`}
                aria-live="polite"
                aria-atomic="true"
              >
                <ExclamationCircleIcon
                  className={`h-5 w-5 ${
                    state.success ? "text-green-500" : "text-red-500"
                  }`}
                />
                <strong>{state.message}</strong>
              </div>
            )}
          </form>
        </div>
        <FormRedirect
          message={"Don't have an account?"}
          linkText={"Sign up"}
          redirectPath={"/sign-up"}
        />
        <hr />
      </div>
    </div>
  );
}
