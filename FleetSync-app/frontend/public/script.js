document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/drivers");
    if (!response.ok) throw new Error("Failed to fetch drivers");
    const drivers = await response.json();

    const driversList = document.getElementById("drivers-list");
    drivers.forEach((driver) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Name: ${driver.name}, License: ${driver.phone}`;
      driversList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading drivers:", error);
  }
});
