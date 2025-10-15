import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Vote, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

const mockAdminStats = {
  totalRegistered: 25000,
  totalVoted: 12450,
  pendingVotes: 12550,
  fraudAlerts: 3,
  regions: [
    { name: "ঢাকা বিভাগ", voters: 15000, voted: 7500, percentage: 50 },
    { name: "চট্টগ্রাম বিভাগ", voters: 6000, voted: 3200, percentage: 53.3 },
    { name: "রাজশাহী বিভাগ", voters: 4000, voted: 1750, percentage: 43.8 },
  ],
};

export function AdminDashboard() {
  const turnoutPercentage = (mockAdminStats.totalVoted / mockAdminStats.totalRegistered) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">অ্যাডমিন ড্যাশবোর্ড</h2>
        <p className="text-muted-foreground">সিস্টেম পরিচালনা এবং পর্যবেক্ষণ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট নিবন্ধিত</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.totalRegistered.toLocaleString('bn-BD')}</div>
            <p className="text-xs text-muted-foreground">ভোটার</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ভোট দিয়েছেন</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockAdminStats.totalVoted.toLocaleString('bn-BD')}</div>
            <p className="text-xs text-muted-foreground">{turnoutPercentage.toFixed(1)}% উপস্থিতি</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">বাকি ভোট</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.pendingVotes.toLocaleString('bn-BD')}</div>
            <p className="text-xs text-muted-foreground">ভোটার</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সতর্কতা</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{mockAdminStats.fraudAlerts.toLocaleString('bn-BD')}</div>
            <p className="text-xs text-muted-foreground">জালিয়াতি সতর্কতা</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>আঞ্চলিক বিশ্লেষণ</CardTitle>
          <CardDescription>বিভাগ অনুযায়ী ভোটার উপস্থিতি</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAdminStats.regions.map((region) => (
              <div key={region.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{region.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {region.voted.toLocaleString('bn-BD')} / {region.voters.toLocaleString('bn-BD')} ভোটার
                  </p>
                </div>
                <Badge 
                  variant={region.percentage > 50 ? "default" : "secondary"}
                  className="gap-1"
                >
                  {region.percentage >= 50 && <CheckCircle2 className="h-3 w-3" />}
                  {region.percentage.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>সিস্টেম স্বাস্থ্য</CardTitle>
          <CardDescription>ব্লকচেইন নেটওয়ার্ক অবস্থা</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium">ব্লকচেইন সক্রিয়</p>
                <p className="text-xs text-muted-foreground">সমস্ত নোড সংযুক্ত</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium">যাচাইকরণ সক্রিয়</p>
                <p className="text-xs text-muted-foreground">০.৫ সেকেন্ড গড় সময়</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium">নিরাপত্তা সক্রিয়</p>
                <p className="text-xs text-muted-foreground">কোন হুমকি নেই</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
