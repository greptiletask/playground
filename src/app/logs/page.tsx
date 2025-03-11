"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogDetailModal } from "@/components/log-detail-modal";
import { getApiLogs, clearApiLogs, type ApiLogEntry } from "@/lib/api-logger";

export default function LogsPage() {
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const apiLogs = await getApiLogs();
    setLogs(
      apiLogs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    );
  };

  const handleClearLogs = () => {
    clearApiLogs();
    setLogs([]);
  };

  const handleRowClick = (log: ApiLogEntry) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-700";
      case "POST":
        return "bg-blue-100 text-blue-700";
      case "PUT":
        return "bg-amber-100 text-amber-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-green-100 text-green-700";
    } else if (status >= 300 && status < 400) {
      return "bg-blue-100 text-blue-700";
    } else if (status >= 400 && status < 500) {
      return "bg-amber-100 text-amber-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="container mx-auto py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Playground Logs</h1>
          <p className="text-muted-foreground">
            View and manage your playground request history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Logs
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Playground
          </Button>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No requests have been logged yet.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Go to Playground
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
          <Table className="table-fixed">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[180px]">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Time
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto max-h-[calc(100vh-16rem)]">
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(log)}
                >
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{formatTime(log.timestamp)}</TableCell>
                  <TableCell>
                    <Badge className={getMethodColor(log.method)}>
                      {log.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.endpoint}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{log.duration}ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedLog && (
        <LogDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          log={selectedLog}
        />
      )}
    </div>
  );
}
