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

export { showSwal };