import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateOrderRequest, type SystemStateResponse } from "@shared/routes";
import { useToast } from "./use-toast";

// GET /api/system/state
export function useSystemState() {
  return useQuery({
    queryKey: [api.system.state.path],
    queryFn: async () => {
      const res = await fetch(api.system.state.path);
      if (!res.ok) throw new Error("Failed to fetch system state");
      // The response structure is typed via z.object({ orders, inventory, sagaLogs })
      return api.system.state.responses[200].parse(await res.json()) as unknown as SystemStateResponse;
    },
    refetchInterval: 2000, // Poll every 2s
  });
}

// POST /api/transactions
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const validated = api.transactions.create.input.parse(data);
      const res = await fetch(api.transactions.create.path, {
        method: api.transactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.transactions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Transaction failed");
      }
      return api.transactions.create.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.system.state.path] });
      toast({
        title: data.status === "CONFIRMED" ? "Order Confirmed" : "Transaction Processed",
        description: data.message,
        variant: data.status === "FAILED" ? "destructive" : "default",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}

// POST /api/system/seed
export function useSeedSystem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.system.seed.path, {
        method: api.system.seed.method,
      });
      if (!res.ok) throw new Error("Failed to seed system");
      return api.system.seed.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.system.state.path] });
      toast({
        title: "System Reset",
        description: "Inventory reset to default values. Order history cleared.",
      });
    },
  });
}
