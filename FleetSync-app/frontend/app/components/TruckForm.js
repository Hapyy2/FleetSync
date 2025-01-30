"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const TruckSchema = Yup.object().shape({
  licensePlate: Yup.string()
    .min(2, "Too Short!")
    .max(10, "Too Long!")
    .required("Required"),
  model: Yup.string().required("Required"),
  mileage: Yup.number()
    .required("Required")
    .min(0, "Mileage cannot be negative"),
  fuel: Yup.number().min(0, "Fuel cannot be negative").required("Required"),
  maxFuel: Yup.number()
    .min(0, "Max Fuel cannot be negative")
    .required("Required"),
  status: Yup.string()
    .oneOf(["operational", "in maintenance"], "Invalid status")
    .required("Required"),
});

const TruckForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [initialValues, setInitialValues] = useState({
    licensePlate: "",
    model: "",
    mileage: 0,
    fuel: 0,
    maxFuel: 400,
    status: "operational",
  });

  const fetchTruck = useCallback(async () => {
    if (!editId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://localhost:3000/api/trucks/id?id=${editId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch truck");

      const data = await response.json();
      if (!data || data.length === 0) {
        throw new Error("No data found for the given ID");
      }

      const truck = data[0];
      setInitialValues({
        licensePlate: truck.licensePlate || "",
        model: truck.model || "",
        mileage: truck.mileage || 0,
        fuel: truck.fuel || 0,
        maxFuel: truck.maxFuel || 400,
        status: truck.status || "operational",
      });
    } catch (err) {
      console.error("Error fetching truck:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [editId]);

  useEffect(() => {
    if (editId) {
      fetchTruck();
    }
  }, [editId, fetchTruck]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = editId
        ? `https://localhost:3000/api/trucks/${editId}`
        : "https://localhost:3000/api/trucks/create";

      const method = editId ? "PATCH" : "POST";

      if (method === "PATCH") {
        const fields = [
          "licensePlate",
          "model",
          "mileage",
          "fuel",
          "maxFuel",
          "status",
        ];
        for (const field of fields) {
          const response = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              field: field,
              value: values[field],
            }),
          });

          if (!response.ok) throw new Error(`Failed to update ${field}`);
        }
      } else {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Failed to create truck");
      }

      setSuccess(
        editId ? "Truck updated successfully!" : "Truck added successfully!"
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
            {editId ? "Edit Truck" : "Add New Truck"}
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
            validationSchema={TruckSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block font-medium">License Plate</label>
                  <Field
                    type="text"
                    name="licensePlate"
                    className="w-full p-2 border rounded"
                  />
                  {errors.licensePlate && touched.licensePlate && (
                    <div className="text-red-500 text-sm">
                      {errors.licensePlate}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Model</label>
                  <Field
                    type="text"
                    name="model"
                    className="w-full p-2 border rounded"
                  />
                  {errors.model && touched.model && (
                    <div className="text-red-500 text-sm">{errors.model}</div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Mileage</label>
                  <Field
                    type="number"
                    name="mileage"
                    className="w-full p-2 border rounded"
                  />
                  {errors.mileage && touched.mileage && (
                    <div className="text-red-500 text-sm">{errors.mileage}</div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Fuel Level</label>
                  <Field
                    type="number"
                    name="fuel"
                    className="w-full p-2 border rounded"
                  />
                  {errors.fuel && touched.fuel && (
                    <div className="text-red-500 text-sm">{errors.fuel}</div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Max Fuel Capacity</label>
                  <Field
                    type="number"
                    name="maxFuel"
                    className="w-full p-2 border rounded"
                  />
                  {errors.maxFuel && touched.maxFuel && (
                    <div className="text-red-500 text-sm">{errors.maxFuel}</div>
                  )}
                </div>

                <div>
                  <label className="block font-medium">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 border rounded"
                  >
                    <option value="operational">Operational</option>
                    <option value="in maintenance">In Maintenance</option>
                  </Field>
                  {errors.status && touched.status && (
                    <div className="text-red-500 text-sm">{errors.status}</div>
                  )}
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
                    : "Add Truck"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TruckForm;
