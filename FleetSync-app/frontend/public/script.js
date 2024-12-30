document.addEventListener("DOMContentLoaded", async () => {
  const driversList = document.getElementById("drivers-list");
  const searchBtn = document.getElementById("search-driver-btn");
  const nameInput = document.getElementById("driver-name");
  const createDriverForm = document.getElementById("create-driver-form");
  const deleteDriverForm = document.getElementById("delete-driver-form");
  const updateDriverForm = document.getElementById("update-driver-form"); // Nowy formularz

  // Funkcja renderująca listę kierowców
  function renderDrivers(drivers) {
    driversList.innerHTML = ""; // Wyczyść poprzednie wyniki
    drivers.forEach((driver) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Name: ${driver.name}, License: ${driver.license}`;
      driversList.appendChild(listItem);
    });
  }

  // Pobierz i wyświetl wszystkich kierowców
  async function fetchAllDrivers() {
    try {
      const response = await fetch("/api/drivers");
      if (!response.ok) throw new Error("Failed to fetch drivers");
      const drivers = await response.json();
      renderDrivers(drivers);
    } catch (error) {
      console.error("Error loading drivers:", error);
    }
  }

  // Pobierz i wyświetl kierowców na podstawie nazwiska
  async function fetchDriverBySurname(surname) {
    try {
      console.log("Searching for surname:", surname); // Debug
      const response = await fetch(
        `/api/drivers/surname?surname=${encodeURIComponent(surname)}`
      );
      if (!response.ok) throw new Error("Failed to fetch driver by surname");
      const drivers = await response.json();
      renderDrivers(drivers);
    } catch (error) {
      console.error("Error searching driver by surname:", error);
    }
  }

  // Obsługa formularza tworzenia kierowcy
  createDriverForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Zapobiegaj przeładowaniu strony

    const newDriver = {
      name: document.getElementById("driver-name-input").value.trim(),
      surname: document.getElementById("driver-surname-input").value.trim(),
      birthdate: document.getElementById("driver-birthdate-input").value,
      email: document.getElementById("driver-email-input").value.trim(),
      phone: document.getElementById("driver-phone-input").value.trim(),
    };

    try {
      const response = await fetch("/api/drivers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Driver created successfully!");
        fetchAllDrivers(); // Odśwież listę kierowców
      } else {
        alert(result.message || "Failed to create driver.");
      }
    } catch (error) {
      console.error("Error creating driver:", error);
      alert("Error creating driver.");
    }
  });

  // Obsługa formularza usuwania kierowcy
  deleteDriverForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Zapobiegaj przeładowaniu strony

    const driverId = document.getElementById("driver-id-input").value.trim();
    if (!driverId) {
      alert("Please enter a driver ID.");
      return;
    }

    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Driver deleted successfully!");
        fetchAllDrivers(); // Odśwież listę kierowców
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete driver.");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Error deleting driver.");
    }
  });

  // Obsługa formularza aktualizacji kierowcy
  updateDriverForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Zapobiegaj przeładowaniu strony

    const driverId = document.getElementById("update-driver-id").value.trim();
    const field = document.getElementById("update-driver-field").value;
    const value = document.getElementById("update-driver-value").value.trim();

    if (!driverId || !field || !value) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const updateData = { field, value };
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: "PATCH", // Wykorzystanie PATCH do częściowych aktualizacji
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Driver updated successfully!");
        fetchAllDrivers(); // Odśwież listę kierowców
      } else {
        alert(result.message || "Failed to update driver.");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Error updating driver.");
    }
  });

  // Obsługa przycisku wyszukiwania
  searchBtn.addEventListener("click", () => {
    const surname = nameInput.value.trim();
    if (surname) {
      fetchDriverBySurname(surname);
    } else {
      alert("Please enter a surname.");
    }
  });

  // Wczytaj listę kierowców przy starcie
  fetchAllDrivers();
});
