"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const initialValues = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      setError("");
      const response = await fetch("https://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.userRole === "coordinator") {
          router.push("/coordinator_panel");
        } else if (data.userRole === "driver") {
          router.push("/driver_panel");
        }
      } else if (response.status === 400) {
        setError("Wrong username.");
      } else if (response.status === 401) {
        setError("Invalid password.");
      } else {
        setError("Could not log in. Please try again later.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-lg font-bold mb-4 text-center">Login</h1>
      {error && (
        <div className="text-red-500 text-sm mb-4 bg-red-100 p-2 rounded-md">
          {error}
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Username
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-teal-400 focus:outline-none"
                placeholder="Enter your username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-teal-400 focus:outline-none"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-200"
            >
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
