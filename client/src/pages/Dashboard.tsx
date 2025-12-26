import { CreateOrderForm } from "@/components/CreateOrderForm";
import { StatusBadge } from "@/components/StatusBadge";
import { useSystemState } from "@/hooks/use-dualstore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, HardDrive, ShoppingCart, RefreshCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data, isLoading, error } = useSystemState();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <RefreshCcw className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Connection Error</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Could not connect to the backend system. Is the server running?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Transaction Creator Section */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CreateOrderForm />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10 h-full flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Hybrid Transaction Coordinator</h3>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                  This system uses the Saga Pattern to coordinate distributed transactions across a PostgreSQL Orders database and a NoSQL Inventory store.
                </p>
              </div>
              <div className="flex gap-4 text-sm font-medium mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Orchestrator Active
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  SQL Store Connected
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  NoSQL Store Connected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System State Section */}
      <section className="animate-in-stagger">
        <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
          <ActivityIcon className="w-6 h-6 text-primary" />
          Real-time System State
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SQL Orders Panel */}
          <Card className="shadow-md border-border/50 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">SQL Store: Orders</CardTitle>
                    <CardDescription>PostgreSQL Database</CardDescription>
                  </div>
                </div>
                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">pg_orders</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader className="bg-muted/20 sticky top-0 z-10 backdrop-blur-sm">
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : data?.orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No orders yet</TableCell>
                      </TableRow>
                    ) : (
                      data?.orders.map((order) => (
                        <TableRow key={order.id} className="font-mono text-xs">
                          <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
                          <TableCell>{order.customerId}</TableCell>
                          <TableCell>{order.sku}</TableCell>
                          <TableCell className="text-right">{order.quantity}</TableCell>
                          <TableCell className="text-right">
                            <StatusBadge status={order.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* NoSQL Inventory Panel */}
          <Card className="shadow-md border-border/50 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-emerald-600" />
                  <div>
                    <CardTitle className="text-base">NoSQL Store: Inventory</CardTitle>
                    <CardDescription>Document Store (NeDB)</CardDescription>
                  </div>
                </div>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-2 py-1 rounded">doc_inventory</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader className="bg-muted/20 sticky top-0 z-10 backdrop-blur-sm">
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">Reserved</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      data?.inventory.map((item) => (
                        <TableRow key={item._id} className="font-mono text-xs">
                          <TableCell className="font-bold text-foreground">{item._id}</TableCell>
                          <TableCell className="text-right font-medium text-emerald-600">{item.available}</TableCell>
                          <TableCell className="text-right font-medium text-orange-600">{item.reserved}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{item.available + item.reserved}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
