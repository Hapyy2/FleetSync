export default function Modal({ onClose, onRefresh, onLogout, timeRemaining }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-96 max-w-[90vw]">
        <h2 className="text-lg font-semibold mb-4">Session Expiry Warning</h2>
        <p className="mb-2">
          Your session will expire in {Math.ceil(timeRemaining / 1000)} seconds.
        </p>
        <p className="mb-4">Would you like to refresh your session?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
          <button
            onClick={onRefresh}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Refresh Session
          </button>
        </div>
      </div>
    </div>
  );
}
