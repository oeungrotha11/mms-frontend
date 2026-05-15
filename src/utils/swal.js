import Swal from "sweetalert2";

export const confirmDialog = (options) => {
  return Swal.fire({
    icon: options.icon || "warning",
    title: options.title || "Are you sure?",
    text: options.text || "This action cannot be undone.",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || "Yes",
    cancelButtonText: options.cancelButtonText || "Cancel",
    reverseButtons: true,
    focusCancel: true
  });
};

export const showSuccess = (message) =>
  Swal.fire({
    icon: "success",
    title: message,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true
  });

export const showError = (message) =>
  Swal.fire({
    icon: "error",
    title: message,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true
  });

export const showInfo = (title, html) =>
  Swal.fire({
    icon: "info",
    title,
    html,
    confirmButtonText: "OK"
  });
