import DriverSidebar from "@/app/components/DriverSidebar.js";

export default function driverMainLayout({ children }) {
  return (
    <div className="flex">
      <DriverSidebar />
      <div className="ml-64 w-full p-8 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
}
