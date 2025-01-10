export default function Modal({ onClose, onRefresh, onLogout }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Session Expiry Warning</h2>
        <p>Your session is about to expire. Would you like to refresh it?</p>
        <div className="flex justify-between mt-4">
          <button
            onClick={onRefresh}
            className="bg-teal-600 text-white py-2 px-4 rounded-md"
          >
            Refresh Session
          </button>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
