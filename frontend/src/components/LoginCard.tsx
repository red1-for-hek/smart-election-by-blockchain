import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Info } from "lucide-react";

interface LoginCardProps {
  onLogin: (nid: string, password: string) => void;
}

export function LoginCard({ onLogin }: LoginCardProps) {
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(nid, password);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">বাংলাদেশ জাতীয় ভোটিং সিস্টেম</h1>
            <p className="text-sm text-muted-foreground">Bangladesh National Voting System</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">লগইন করুন</CardTitle>
          <CardDescription>আপনার NID নম্বর এবং পাসওয়ার্ড দিয়ে লগইন করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>পরীক্ষার জন্য:</strong> NID: <code className="font-mono">1234567890</code> | পাসওয়ার্ড: <code className="font-mono">NoPassword</code>
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nid">জাতীয় পরিচয়পত্র নম্বর (NID)</Label>
              <Input
                id="nid"
                type="text"
                placeholder="১২৩৪৫৬৭৮৯০"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                data-testid="input-nid"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-login">
              লগইন করুন
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button variant="ghost" className="text-sm" data-testid="link-forgot-password">
              পাসওয়ার্ড ভুলে গেছেন?
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>ব্লকচেইন সুরক্ষিত</span>
      </div>
    </div>
  );
}
