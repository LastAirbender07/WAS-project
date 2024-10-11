import React from "react";

const RegisterForm = ({handleRegisterForm, handleInputChange, formData, errors}) => {
  return (
    <div>
      <div className="flex w-[350px] rounded-2xl overflow-hidden z-50 items-center justify-center bg-gray-100">
        <form
          className="flex flex-col w-full items-center justify-center px-3 py-5"
          onSubmit={handleRegisterForm}
        >
          <section className="w-full">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Register
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Create your account
            </h1>
          </section>

          <section className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              className={`border mb-2 py-2 px-3 rounded text-gray-700 w-full ${
                errors.username ? "border-red-500" : ""
              }`}
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic">{errors.username}</p>
            )}
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
              placeholder="e.g. example@example.com"
              value={formData.email}
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
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
          </section>

          <section className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className={`border mb-2 py-2 px-3 rounded text-gray-700 w-full ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              name="confirmPassword"
              type="password"
              placeholder="* * * * * * * *"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmPassword}
              </p>
            )}
          </section>

          <section className="w-full">
            <button className="w-full rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4">
              Register
            </button>
          </section>

          <section>
            <p className="text-gray-500 text-xs text-center mt-5">
              Already have an account?{" "}
              <a
                href="/"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Login
              </a>
            </p>
          </section>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
