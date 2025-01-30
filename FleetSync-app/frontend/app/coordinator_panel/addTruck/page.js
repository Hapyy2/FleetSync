import TruckForm from "@/app/components/TruckForm";

export default function AddTruck() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Add/Edit Truck</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <TruckForm type="trucks" />
      </main>
    </div>
  );
}
