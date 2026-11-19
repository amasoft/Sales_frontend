import { useState } from "react";
import { UserPlus } from "lucide-react";
import type { Customer } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CustomerFormDialog } from "@/components/customers/CustomerFormDialog";

export const WALK_IN_VALUE = "walk-in";

interface CustomerPickerProps {
  customers: Customer[];
  value: string;
  onChange: (value: string) => void;
}

export function CustomerPicker({ customers, value, onChange }: CustomerPickerProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select customer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={WALK_IN_VALUE}>Walk-in Customer</SelectItem>
          {customers.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" variant="secondary" size="icon" onClick={() => setAddOpen(true)} aria-label="Add customer">
        <UserPlus className="h-4 w-4" />
      </Button>

      <CustomerFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={(customer) => onChange(String(customer.id))}
      />
    </div>
  );
}
