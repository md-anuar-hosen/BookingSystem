const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

const form = document.getElementById("reservationForm");
const list = document.getElementById("list");
const msg = document.getElementById("message");

function showMessage(text) {
  msg.innerText = text;
}

async function loadReservations() {
  const res = await fetch("/api/reservations", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();

  list.innerHTML = "";

  data.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${r.id} - ${r.note}
      <button onclick="deleteReservation(${r.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    resourceId: Number(resourceId.value),
    userId: Number(userId.value),
    startTime: new Date(startTime.value).toISOString(),
    endTime: new Date(endTime.value).toISOString(),
    note: note.value,
    status: status.value
  };

  const res = await fetch("/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  if (res.status === 201) {
    showMessage("Saved!");
    loadReservations();
  } else {
    showMessage("Error!");
  }
});

async function deleteReservation(id) {
  await fetch(`/api/reservations/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  loadReservations();
}

loadReservations();