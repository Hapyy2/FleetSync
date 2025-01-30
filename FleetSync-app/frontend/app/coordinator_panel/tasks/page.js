import TaskList from "@/app/components/TaskList";

export default function CoordinatorTasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Tasks</h1>
      <TaskList />
    </div>
  );
}
