import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { authClient } from '~/utils/auth'
import { ErrorBox } from "~/components/ErrorBox";

export const Route = createFileRoute('/sign-in')({
    component: SignIn,
})

function SignIn() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        await authClient.signIn.email({
          email,
          password,
          fetchOptions: {
            onSuccess: () => {
              navigate({ to: "/" });
            },
            onError: (err) => {
              setError(err.error.message);
            },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex justify-center p-4">
        <Card className="w-full max-w-md bg-white h-fit mt-10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Sign In to Magic Memories
            </CardTitle>
            <CardDescription>
              Enter your email and password to access your magical memory
              collection
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <ErrorBox>{error}</ErrorBox>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
}

