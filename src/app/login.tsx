"use client";
import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Login() {
  return (
    <div className="flex h-[100vh] items-center justify-center">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={async () => {
              await signIn("google");
            }}
          >
            Continue with Google
          </Button>
          {/* <div className="space-y-4"> */}
          {/*   <div className="space-y-2"> */}
          {/*     <Label htmlFor="email">Email</Label> */}
          {/*     <Input */}
          {/*       id="email" */}
          {/*       type="email" */}
          {/*       placeholder="m@example.com" */}
          {/*       required */}
          {/*     /> */}
          {/*   </div> */}
          {/*   <div className="space-y-2"> */}
          {/*     <Label htmlFor="password">Password</Label> */}
          {/*     <Input id="password" type="password" required /> */}
          {/*   </div> */}
          {/*   <Button type="submit" className="w-full"> */}
          {/*     Login */}
          {/*   </Button> */}
          {/* </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
