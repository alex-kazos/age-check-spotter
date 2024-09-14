import { toast } from "sonner";

export const useToast = () => {
  const showToast = (message, type = "default") => {
    toast[type](message, {
      duration: 5000,
    });
  };

  return { showToast };
};