"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const CoordinatorDashboard = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("drivers");
  const [searchResults, setSearchResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAllData = async (tab) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = `https://localhost:3000/api/${tab}`;
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Failed to fetch ${tab}`);

      const data = await response.json();
      setAllData(data);
      setSearchResults([]);
    } catch (err) {
      setError(err.message);
      setAllData([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllData(activeTab);
  }, [activeTab]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        activeTab === "drivers"
          ? `https://localhost:3000/api/drivers/surname?surname=${searchQuery}`
          : `https://localhost:3000/api/trucks/licenseplate?licensePlate=${searchQuery}`;

      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Failed to fetch ${activeTab}`);

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleEdit = (item) => {
    const route =
      activeTab === "drivers"
        ? `/coordinator_panel/addDriver?edit=${item._id}&surname=${item.surname}`
        : `/coordinator_panel/addTruck?edit=${item._id}`;
    router.push(route);
  };

  const handleDelete = async () => {
    try {
      const endpoint = `https://localhost:3000/api/${activeTab}/${selectedItem._id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setSuccessMessage(
        `${activeTab === "drivers" ? "Driver" : "Truck"} deleted successfully`
      );
      setDeleteModalOpen(false);
      setDetailModalOpen(false);
      fetchAllData(activeTab);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">
          Are you sure you want to delete this{" "}
          {activeTab === "drivers" ? "driver" : "truck"}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
          {successMessage}
        </div>
      )}

      <div className="flex space-x-4 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "drivers"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("drivers");
            setSearchResults([]);
            setSearchQuery("");
            fetchAllData("drivers");
          }}
        >
          Drivers
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "trucks"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("trucks");
            setSearchResults([]);
            setSearchQuery("");
            fetchAllData("trucks");
          }}
        >
          Trucks
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="flex-1 flex items-center border rounded-lg p-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder={
              activeTab === "drivers"
                ? "Search by surname..."
                : "Search by license plate..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      <div className="space-y-4">
        {(searchResults.length > 0 ? searchResults : allData).map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => openDetailModal(item)}
          >
            <div>
              <h3 className="font-medium">
                {activeTab === "drivers"
                  ? `${item.name} ${item.surname}`
                  : item.licensePlate}
              </h3>
              <p className="text-sm text-gray-500">
                {activeTab === "drivers"
                  ? `Email: ${item.email}`
                  : `Model: ${item.model}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {detailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setDetailModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-semibold mb-4">Details</h3>

            {activeTab === "drivers" ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {selectedItem.name}{" "}
                  {selectedItem.surname}
                </p>
                <p>
                  <strong>Email:</strong> {selectedItem.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedItem.phone}
                </p>
                <p>
                  <strong>Birth Date:</strong>{" "}
                  {new Date(selectedItem.birthDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Employment Date:</strong>{" "}
                  {new Date(selectedItem.employmentDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {selectedItem.status}
                </p>
                {selectedItem.fullAddress && (
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>{selectedItem.fullAddress.address}</p>
                    <p>
                      {selectedItem.fullAddress.city},{" "}
                      {selectedItem.fullAddress.state}{" "}
                      {selectedItem.fullAddress.postalCode}
                    </p>
                    <p>{selectedItem.fullAddress.country}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>License Plate:</strong> {selectedItem.licensePlate}
                </p>
                <p>
                  <strong>Model:</strong> {selectedItem.model}
                </p>
                <p>
                  <strong>Mileage:</strong> {selectedItem.mileage} km
                </p>
                <p>
                  <strong>Fuel:</strong> {selectedItem.fuel}/
                  {selectedItem.maxFuel} L
                </p>
                <p>
                  <strong>Status:</strong> {selectedItem.status}
                </p>
                <p>
                  <strong>Current Driver:</strong>{" "}
                  {selectedItem.currentDriver || "None"}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => handleEdit(selectedItem)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && <DeleteConfirmationModal />}
    </div>
  );
};

export default CoordinatorDashboard;
