import React from "react";

const LoginForm = ({handleLoginForm, handleInputChange, credentials, errors}) => {
  return (
    <div>
      <div className="flex w-[350px] rounded-2xl overflow-hidden z-50 items-center justify-center bg-gray-100">
        <form
          className="flex flex-col w-full items-center justify-center px-3 py-5"
          onSubmit={handleLoginForm}
        >
          <section className="w-full">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Login
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Welcome back! Log in to your account
            </h1>
          </section>
          <section className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              className={`border mb-2 py-2 px-3 rounded text-gray-700 w-full ${
                errors.email ? "border-red-500" : ""
              }`}
              name="email"
              type="email"
              placeholder="e.g. example@mail.com"
              value={credentials.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </section>
          <section className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              className={`border mb-2 py-2 px-3 rounded text-gray-700 w-full ${
                errors.password ? "border-red-500" : ""
              }`}
              name="password"
              type="password"
              placeholder="* * * * * * * *"
              value={credentials.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
          </section>
          <section className="w-full">
            <button className="w-full rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4">
              Sign in
            </button>
          </section>
          <section>
            <p className="text-gray-500 text-xs text-center mt-5">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Register
              </a>
            </p>
          </section>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
