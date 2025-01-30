"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const TaskSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  deliveryDate: Yup.date().required("Required"),
  deliveryAddress: Yup.object().shape({
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    postalCode: Yup.string()
      .matches(/^\d{5}$/, "Invalid postal code")
      .required("Required"),
    country: Yup.string().required("Required"),
  }),
  status: Yup.string()
    .oneOf(["Waiting", "In progress", "On hold", "Completed"])
    .default("Waiting"),
  description: Yup.string(),
  driver: Yup.string(),
  truck: Yup.string(),
});

const TaskForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    deliveryDate: "",
    deliveryAddress: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    status: "Waiting",
    description: "",
    driver: "",
    truck: "",
  });

  const fetchResources = useCallback(async () => {
    try {
      const [driversResponse, trucksResponse] = await Promise.all([
        fetch("https://localhost:3000/api/drivers", {
          credentials: "include",
        }),
        fetch("https://localhost:3000/api/trucks", {
          credentials: "include",
        }),
      ]);

      if (driversResponse.ok && trucksResponse.ok) {
        const drivers = await driversResponse.json();
        const trucks = await trucksResponse.json();
        setAvailableDrivers(drivers);
        setAvailableTrucks(trucks.filter((t) => t.status === "operational"));
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError("Failed to load drivers and trucks");
    }
  }, []);

  const fetchTask = useCallback(async () => {
    if (!editId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://localhost:3000/api/tasks/id?id=${editId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch task details");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("Task not found");
      }

      const task = data[0];
      setInitialValues({
        name: task.name,
        deliveryDate: new Date(task.deliveryDate).toISOString().split("T")[0],
        deliveryAddress: {
          address: task.deliveryAddress?.address || "",
          city: task.deliveryAddress?.city || "",
          state: task.deliveryAddress?.state || "",
          postalCode: task.deliveryAddress?.postalCode || "",
          country: task.deliveryAddress?.country || "",
        },
        status: task.status || "Waiting",
        description: task.description || "",
        driver: task.driver ? JSON.stringify(task.driver) : "",
        truck: task.truck || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [editId]);

  useEffect(() => {
    fetchResources();
    if (editId) {
      fetchTask();
    }
  }, [editId, fetchResources, fetchTask]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const processedValues = {
      ...values,
      driver: values.driver ? JSON.parse(values.driver) : null,
      truck: values.truck || null,
    };
    try {
      const url = editId
        ? `https://localhost:3000/api/tasks/${editId}`
        : "https://localhost:3000/api/tasks/create";

      const method = editId ? "PATCH" : "POST";

      if (editId) {
        const processedValues = {
          ...values,
          driver: values.driver ? JSON.parse(values.driver) : null,
          truck: values.truck || null,
        };

        const fieldsToUpdate = [
          { field: "name", value: processedValues.name },
          { field: "deliveryDate", value: processedValues.deliveryDate },
          { field: "deliveryAddress", value: processedValues.deliveryAddress },
          { field: "status", value: processedValues.status },
          { field: "description", value: processedValues.description },
          { field: "driver", value: processedValues.driver },
          { field: "truck", value: processedValues.truck },
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
              `Failed to update ${update.field}: ${
                errorData.message || "Unknown error"
              }`
            );
          }
        }
      }

      setSuccess(
        editId ? "Task updated successfully!" : "Task created successfully!"
      );

      setTimeout(() => {
        router.push("/coordinator_panel/tasks");
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
            {editId ? "Edit Task" : "Add New Task"}
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
            validationSchema={TaskSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block font-medium">Task Name</label>
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
                  <label className="block font-medium">Delivery Date</label>
                  <Field
                    type="date"
                    name="deliveryDate"
                    className="w-full p-2 border rounded"
                  />
                  {errors.deliveryDate && touched.deliveryDate && (
                    <div className="text-red-500 text-sm">
                      {errors.deliveryDate}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 border rounded"
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="In progress">In Progress</option>
                    <option value="On hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </Field>
                </div>

                <div>
                  <label className="block font-medium">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="w-full p-2 border rounded h-24"
                  />
                </div>

                <div>
                  <label className="block font-medium">Assign Driver</label>
                  <Field
                    as="select"
                    name="driver"
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a driver</option>
                    {availableDrivers.map((driver) => {
                      const driverValue = JSON.stringify({
                        name: driver.name,
                        surname: driver.surname,
                        email: driver.email,
                        phone: driver.phone,
                      });
                      return (
                        <option key={driver._id} value={driverValue}>
                          {driver.name} {driver.surname}
                        </option>
                      );
                    })}
                  </Field>
                </div>

                <div>
                  <label className="block font-medium">Assign Truck</label>
                  <Field
                    as="select"
                    name="truck"
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a truck</option>
                    {availableTrucks.map((truck) => (
                      <option key={truck._id} value={truck.licensePlate}>
                        {truck.licensePlate} - {truck.model}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold">Delivery Address</h3>
                  <div className="space-y-4 mt-2">
                    <div>
                      <label className="block font-medium">
                        Street Address
                      </label>
                      <Field
                        type="text"
                        name="deliveryAddress.address"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium">City</label>
                        <Field
                          type="text"
                          name="deliveryAddress.city"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">State</label>
                        <Field
                          type="text"
                          name="deliveryAddress.state"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium">Postal Code</label>
                        <Field
                          type="text"
                          name="deliveryAddress.postalCode"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Country</label>
                        <Field
                          type="text"
                          name="deliveryAddress.country"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editId
                      ? "Save Changes"
                      : "Create Task"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
