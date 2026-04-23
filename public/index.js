 async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      // CLICK → FILL FORM
      div.addEventListener("click", () => {
        document.getElementById("customerId").value = person.id;

        document.getElementById("firstName").value = person.first_name;
        document.getElementById("lastName").value = person.last_name;
        document.getElementById("email").value = person.email;
        document.getElementById("phone").value = person.phone || "";

        document.getElementById("birthDate").value = person.birth_date
          ? person.birth_date.split("T")[0]
          : "";
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

// CREATE + UPDATE
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("customerId").value;

  const customer = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    birth_date: document.getElementById("birthDate").value
  };

  try {
    if (id) {
      await fetch(`/api/persons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      });

      alert("Customer updated successfully ✅");

    } else {
      await fetch("/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      });

      alert("Customer added successfully ✅");
    }

    loadCustomers();
    document.getElementById("form").reset();
    document.getElementById("customerId").value = "";

  } catch (err) {
    console.error("Save failed:", err);
    alert("Error saving customer ❌");
  }
});

// DELETE
document.getElementById("deleteBtn").addEventListener("click", async () => {
  const id = document.getElementById("customerId").value;

  if (!id) {
    alert("Please select a customer first");
    return;
  }

  try {
    await fetch(`/api/persons/${id}`, {
      method: "DELETE"
    });

    alert("Customer deleted successfully 🗑️");

    loadCustomers();
    document.getElementById("form").reset();
    document.getElementById("customerId").value = "";

  } catch (err) {
    console.error("Delete failed:", err);
    alert("Error deleting customer ❌");
  }
});

// INITIAL LOAD
loadCustomers();