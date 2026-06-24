"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SwitchDemo({
  id,
  label,
  checked = false,
  onCheckedChange,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      {label && (
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
      )}
    </div>
  );
}
