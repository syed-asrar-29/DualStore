import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTransaction } from "@/hooks/use-dualstore";
import { createOrderRequestSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

// Frontend needs strict typing for the form state
const formSchema = createOrderRequestSchema;
type FormValues = z.infer<typeof formSchema>;

export function CreateOrderForm() {
  const { mutate, isPending } = useCreateTransaction();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "USER-" + Math.floor(Math.random() * 1000),
      sku: "ITEM-001",
      quantity: 1,
      simulateFailure: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => {
        // Generate new random user ID for convenience
        form.setValue("customerId", "USER-" + Math.floor(Math.random() * 1000));
      }
    });
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">New Transaction</h2>
          <p className="text-sm text-muted-foreground">Initiate a distributed transaction saga</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="h-4 w-4 text-primary" />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl>
                    <Input placeholder="USER-123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product SKU</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ITEM-001">ITEM-001 (Laptop)</SelectItem>
                      <SelectItem value="ITEM-002">ITEM-002 (Monitor)</SelectItem>
                      <SelectItem value="ITEM-003">ITEM-003 (Mouse)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
             <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="simulateFailure"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3 bg-muted/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Simulate Failure</FormLabel>
                    <FormDescription>
                      Forces a failure to trigger saga compensation logic.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              "Submit Order"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
