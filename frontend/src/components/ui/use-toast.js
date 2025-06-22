import { toast } from "sonner"

export function useToast() {
  return {
    toast: ({ title, description, variant, duration, ...props }) => {
      if (variant === "destructive") {
        toast.error(description || title, {
          duration,
          ...props
        });
      } else {
        toast.success(description || title, {
          duration,
          ...props
        });
      }
    },
    dismiss: (toastId) => toast.dismiss(toastId),
  }
} 