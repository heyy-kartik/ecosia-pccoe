import { ClerkProvider, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <div className="flex min-h-screen items-center justify-center bg-background">
        <SignIn />
      </div>
    </ClerkProvider>
  );
}
