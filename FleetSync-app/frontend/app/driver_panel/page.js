import TaskList from "@/app/components/TaskList";

export default function DriverTasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Tasks</h1>
      <TaskList />
    </div>
  );
}
