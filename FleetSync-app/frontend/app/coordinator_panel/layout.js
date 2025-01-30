import CoordinatorSidebar from "@/app/components/CoordinatorSidebar";

export default function coordinatorMainLayout({ children }) {
  return (
    <div className="flex">
      <CoordinatorSidebar />
      <div className="ml-64 w-full p-8 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
}
