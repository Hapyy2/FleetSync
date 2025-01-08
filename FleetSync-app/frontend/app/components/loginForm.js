"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    username: "",
    password: "",
  };

  // Submit handler
  const handleSubmit = async (values) => {
    try {
      setError(""); // Reset error state
      const response = await fetch("https://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", // Make sure cookies are sent and received
      });

      if (response.ok) {
        const data = await response.json();

        // Redirect based on role
        if (data.userRole === "coordinator") {
          router.push("/coordinator_panel");
        } else if (data.userRole === "driver") {
          router.push("/driver_panel");
        }
      } else if (response.status === 400) {
        setError("Wrong username.");
      } else if (response.status === 401) {
        setError("Invalid password.");
      } else if (response.status === 500) {
        setError("Could not log in. Please try again later.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-800 text-teal-400 p-6 rounded-md shadow-md max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1 text-teal-300"
              >
                Username
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-teal-400 focus:outline-none"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-teal-300"
              >
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-teal-400 focus:outline-none"
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
