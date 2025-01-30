"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const DriverSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  surname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  birthDate: Yup.date().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string()
    .matches(/^[0-9-]+$/, "Invalid phone number")
    .required("Required"),
  fullAddress: Yup.object().shape({
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    postalCode: Yup.string()
      .matches(/^\d{5}$/, "Invalid postal code")
      .required("Required"),
    country: Yup.string().required("Required"),
  }),
});

const DriverForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const surname = searchParams.get("surname"); // Add this line

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    surname: "",
    birthDate: "",
    email: "",
    phone: "",
    fullAddress: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const fetchDriver = useCallback(async () => {
    if (!editId || !surname) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching driver with surname:", surname);
      const response = await fetch(
        `https://localhost:3000/api/drivers/surname?surname=${surname}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText);
        throw new Error(
          `Failed to fetch driver: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No data found for the driver");
      }

      const driver = data.find((d) => d._id === editId);

      if (!driver) {
        throw new Error("Driver not found in results");
      }

      setInitialValues({
        name: driver.name || "",
        surname: driver.surname || "",
        birthDate: driver.birthDate
          ? new Date(driver.birthDate).toISOString().split("T")[0]
          : "",
        email: driver.email || "",
        phone: driver.phone || "",
        fullAddress: {
          address: driver.fullAddress?.address || "",
          city: driver.fullAddress?.city || "",
          state: driver.fullAddress?.state || "",
          postalCode: driver.fullAddress?.postalCode || "",
          country: driver.fullAddress?.country || "",
        },
      });
    } catch (err) {
      console.error("Error fetching driver:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [editId, surname]);

  useEffect(() => {
    if (editId) {
      fetchDriver();
    }
  }, [editId, fetchDriver]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = editId
        ? `https://localhost:3000/api/drivers/${editId}`
        : "https://localhost:3000/api/drivers/create";

      const method = editId ? "PATCH" : "POST";

      const sendUpdates = async () => {
        const fieldsToUpdate = [
          { field: "name", value: values.name },
          { field: "surname", value: values.surname },
          { field: "birthDate", value: values.birthDate },
          { field: "email", value: values.email },
          { field: "phone", value: values.phone },
          { field: "fullAddress", value: values.fullAddress },
        ];

        for (const update of fieldsToUpdate) {
          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              field: update.field,
              value: update.value,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Failed to update ${update.field}`
            );
          }
        }
      };

      if (editId) {
        await sendUpdates();
      } else {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save driver");
        }
      }

      setSuccess(
        editId ? "Driver updated successfully!" : "Driver added successfully!"
      );

      setTimeout(() => {
        router.push("/coordinator_panel");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow max-w-2xl mx-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            {editId ? "Edit Driver" : "Add New Driver"}
          </h2>
        </div>
        <div className="p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={DriverSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full p-2 border rounded"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-sm">{errors.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium">Surname</label>
                    <Field
                      type="text"
                      name="surname"
                      className="w-full p-2 border rounded"
                    />
                    {errors.surname && touched.surname && (
                      <div className="text-red-500 text-sm">
                        {errors.surname}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-medium">Birth Date</label>
                  <Field
                    type="date"
                    name="birthDate"
                    className="w-full p-2 border rounded"
                  />
                  {errors.birthDate && touched.birthDate && (
                    <div className="text-red-500 text-sm">
                      {errors.birthDate}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full p-2 border rounded"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Phone</label>
                  <Field
                    type="text"
                    name="phone"
                    className="w-full p-2 border rounded"
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-sm">{errors.phone}</div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold">Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium">
                        Street Address
                      </label>
                      <Field
                        type="text"
                        name="fullAddress.address"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium">City</label>
                        <Field
                          type="text"
                          name="fullAddress.city"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">State</label>
                        <Field
                          type="text"
                          name="fullAddress.state"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium">Postal Code</label>
                        <Field
                          type="text"
                          name="fullAddress.postalCode"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Country</label>
                        <Field
                          type="text"
                          name="fullAddress.country"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editId
                    ? "Save Changes"
                    : "Add Driver"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default DriverForm;
