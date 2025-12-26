import { useSystemState } from "@/hooks/use-dualstore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { FileText, Clock } from "lucide-react";

export default function Logs() {
  const { data, isLoading } = useSystemState();

  // Sort logs by newest first
  const logs = data?.sagaLogs 
    ? [...data.sagaLogs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Saga Transaction Logs</h1>
          <p className="text-muted-foreground">Audit trail of distributed transactions and compensations</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">Event Stream</CardTitle>
          </div>
          <CardDescription>
            Real-time log of saga state transitions stored in NoSQL
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <Table>
              <TableHeader className="bg-muted/20 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-[200px]">Transaction ID</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Context / Metadata</TableHead>
                  <TableHead className="w-[180px] text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No transaction logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log._id} className="font-mono text-xs group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-foreground">{log._id}</TableCell>
                      <TableCell>
                        <StatusBadge status={log.state} />
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        <pre className="inline text-[10px] text-muted-foreground">
                          {JSON.stringify(log.context, null, 1).replace(/{|}|"/g, '')}
                        </pre>
                        {log.context.error && (
                          <div className="text-red-600 mt-1 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"/>
                            {log.context.error}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        <div className="flex items-center justify-end gap-1.5">
                          <Clock className="w-3 h-3 opacity-50" />
                          {formatDistanceToNow(new Date(log.updatedAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
