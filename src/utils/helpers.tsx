import Swal from "sweetalert2";

type SwalIcon = "success" | "error" | "warning" | "info" | "question";

const showSwal = (
  title: string,
  icon: SwalIcon,
  confirmButtonText: string
) => {
  return Swal.fire({
    title,
    icon,
    confirmButtonText,
  });
};

const toast = Swal.mixin({
  toast: true, position: 'top-start', showConfirmButton: false, timer: 1800, timerProgressBar: true,
})

export { showSwal, toast }