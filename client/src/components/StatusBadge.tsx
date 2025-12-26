import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant = "bg-gray-100 text-gray-700 border-gray-200";
  
  switch (status.toUpperCase()) {
    // Order Statuses
    case "PENDING":
      variant = "bg-yellow-50 text-yellow-700 border-yellow-200";
      break;
    case "CONFIRMED":
      variant = "bg-green-50 text-green-700 border-green-200";
      break;
    case "CANCELLED":
      variant = "bg-red-50 text-red-700 border-red-200";
      break;
      
    // Saga Statuses
    case "STARTED":
      variant = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "COMMITTED":
      variant = "bg-green-50 text-green-700 border-green-200";
      break;
    case "COMPENSATING":
      variant = "bg-orange-50 text-orange-700 border-orange-200";
      break;
    case "COMPENSATED":
      variant = "bg-orange-100 text-orange-800 border-orange-200";
      break;
    case "FAILED":
      variant = "bg-red-50 text-red-700 border-red-200";
      break;
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
      variant,
      className
    )}>
      {status}
    </span>
  );
}
