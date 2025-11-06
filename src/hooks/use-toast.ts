type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | string;
  duration?: number;
};

export function toast(opts: ToastOptions) {
  if (typeof window !== "undefined") {
    // stub: replace with your real UI/toaster later
    console.log("[toast]", opts.title ?? "", opts.description ?? "", opts.variant ?? "default");
  }
}
export function useToast() {
  return { toast };
}
