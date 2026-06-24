"use client";

import LoginForm from "@/components/login-form";
import { IconBrandSpeedtest } from "@tabler/icons-react";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-3xl md:max-w-4xl flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <IconBrandSpeedtest className="size-4" />
          </div>
          Torque
        </div>

        <LoginForm />
      </div>
    </div>
  );
}