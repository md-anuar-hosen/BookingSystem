 // ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");
const resourceDescriptionInput = document.getElementById("resourceDescription");

// Example roles
const role = "admin"; // "reserver" | "admin"

// Button references
let createButton = null;
let updateButton = null;
let deleteButton = null;

// ===============================
// 2) Button creation helpers
// ===============================

const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");

  btn.type = type;
  btn.textContent = label;
  btn.name = "action";

  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`;

  actions.appendChild(btn);

  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);
}

function renderActionButtons(currentRole) {

  if (currentRole === "admin") {

    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES
    });

    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES
    });
  }

  if (currentRole === "reserver") {

    createButton = addButton({
      label: "Create",
      type: "submit",
      classes: BUTTON_ENABLED_CLASSES
    });
  }

  // Disable buttons initially
  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

// ===============================
// 3) Input creation + validation
// ===============================

function createResourceNameInput(container) {

  const input = document.createElement("input");

  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";

  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  container.appendChild(input);

  return input;
}

// ===============================
// Validation rules
// ===============================

function isResourceNameValid(value) {

  const trimmed = value.trim();

  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  const lengthValid = trimmed.length >= 5 && trimmed.length <= 30;
  const charactersValid = allowedPattern.test(trimmed);

  return lengthValid && charactersValid;
}

function isResourceDescriptionValid(value) {

  const trimmed = value.trim();

  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;

  const lengthValid = trimmed.length >= 10 && trimmed.length <= 50;
  const charactersValid = allowedPattern.test(trimmed);

  return lengthValid && charactersValid;
}

// ===============================
// Input visual feedback
// ===============================

function setInputVisualState(input, state) {

  input.classList.remove(
    "border-green-500",
    "bg-green-100",
    "border-red-500",
    "bg-red-100"
  );

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100");
  }

  if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100");
  }
}

// ===============================
// Combined validation logic
// ===============================

function updateValidation() {

  const nameValue = resourceNameInput.value;
  const descValue = resourceDescriptionInput.value;

  const nameValid = isResourceNameValid(nameValue);
  const descValid = isResourceDescriptionValid(descValue);

  // Update colors
  if (nameValue.trim() === "") {
    setInputVisualState(resourceNameInput, "neutral");
  } else {
    setInputVisualState(resourceNameInput, nameValid ? "valid" : "invalid");
  }

  if (descValue.trim() === "") {
    setInputVisualState(resourceDescriptionInput, "neutral");
  } else {
    setInputVisualState(resourceDescriptionInput, descValid ? "valid" : "invalid");
  }

  // Enable Create ONLY if both valid
  setButtonEnabled(createButton, nameValid && descValid);
}

// ===============================
// 4) Bootstrapping
// ===============================

renderActionButtons(role);

// Create name input
const resourceNameInput = createResourceNameInput(resourceNameContainer);

// Real-time validation
resourceNameInput.addEventListener("input", updateValidation);
resourceDescriptionInput.addEventListener("input", updateValidation);

// Initial state
updateValidation();