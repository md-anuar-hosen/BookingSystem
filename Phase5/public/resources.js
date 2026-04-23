 // ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameCnt = document.getElementById("resourceNameCnt");
const resourceDescriptionCnt = document.getElementById("resourceDescriptionCnt");

const role = "admin";

// Buttons
let createButton = null;
let primaryActionButton = null;
let clearButton = null;

// Validation flags (only for UI color, NOT blocking)
let resourceNameValid = false;
let resourceDescriptionValid = false;

let formMode = "create";

// ===============================
// 2) Button helpers
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

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

// 🚨 FIX: NEVER disable submit button
function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = false; // always enabled
  btn.classList.remove("cursor-not-allowed", "opacity-50");
}

// ===============================
// 3) Render buttons
// ===============================
function renderActionButtons(currentRole) {
  actions.innerHTML = "";

  if (currentRole === "admin" && formMode === "create") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    clearButton = addButton({
      label: "Clear",
      type: "button",
      classes: BUTTON_ENABLED_CLASSES,
    });

    // Always enabled
    setButtonEnabled(createButton, true);
    primaryActionButton = createButton;

    clearButton.addEventListener("click", clearResourceForm);
  }

  if (currentRole === "admin" && formMode === "edit") {
    const updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    const deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });

    primaryActionButton = updateButton;
  }
}

// ===============================
// 4) Input creation
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
  `;

  container.appendChild(input);
  return input;
}

function createResourceDescriptionArea(container) {
  const textarea = document.createElement("textarea");

  textarea.id = "resourceDescription";
  textarea.name = "resourceDescription";
  textarea.rows = 5;

  textarea.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
  `;

  container.appendChild(textarea);
  return textarea;
}

// ===============================
// 5) Validation (UI only)
// ===============================
function isResourceNameValid(value) {
  return /^[A-Za-z0-9 ]+$/.test(value) && value.length >= 5;
}

function isResourceDescriptionValid(value) {
  return /^[A-Za-z0-9 ]+$/.test(value) && value.length >= 10;
}

function setInputVisualState(input, valid) {
  input.classList.remove("border-green-500", "bg-green-100", "border-red-500", "bg-red-100");

  if (valid === true) {
    input.classList.add("border-green-500", "bg-green-100");
  } else if (valid === false) {
    input.classList.add("border-red-500", "bg-red-100");
  }
}

// FIX: DO NOT disable button
function attachResourceNameValidation(input) {
  input.addEventListener("input", () => {
    const valid = isResourceNameValid(input.value);
    resourceNameValid = valid;
    setInputVisualState(input, valid);
  });
}

function attachResourceDescriptionValidation(input) {
  input.addEventListener("input", () => {
    const valid = isResourceDescriptionValid(input.value);
    resourceDescriptionValid = valid;
    setInputVisualState(input, valid);
  });
}

// ===============================
// 6) Clear form
// ===============================
function clearResourceForm() {
  resourceNameInput.value = "";
  resourceDescriptionArea.value = "";
}

// ===============================
// 7) Boot
// ===============================
renderActionButtons(role);

const resourceNameInput = createResourceNameInput(resourceNameCnt);
attachResourceNameValidation(resourceNameInput);

const resourceDescriptionArea = createResourceDescriptionArea(resourceDescriptionCnt);
attachResourceDescriptionValidation(resourceDescriptionArea);

// ===============================
// 8) Success handler
// ===============================
window.onResourceActionSuccess = ({ action, data }) => {
  if (action === "create" && data === "success") {
    formMode = "edit";
    renderActionButtons(role);
  }
};