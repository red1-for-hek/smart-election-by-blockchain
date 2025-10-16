import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from "lucide-react";

const mockStats = {
  totalVotes: 12450,
  totalVoters: 25000,
  candidates: [
    { name: "আবদুল করিম", nameEn: "Abdul Karim", party: "Jamaat-e-Islami", votes: 3200, color: "#2D8B3C", hashId: "JAM-134" },
    { name: "রহিমা খাতুন", nameEn: "Rahima Khatun", party: "BNP", votes: 4100, color: "#FF8C00", hashId: "BNP-201" },
    { name: "মোহাম্মদ আলী", nameEn: "Mohammad Ali", party: "NCP", votes: 2800, color: "#4169E1", hashId: "NCP-089" },
    { name: "ফাতেমা বেগম", nameEn: "Fatema Begum", party: "Jatiya Party", votes: 2350, color: "#DC143C", hashId: "JAT-256" },
  ],
};

export function StatisticsDashboard() {
  const [selectedLevel, setSelectedLevel] = useState("national");
  
  const turnoutPercentage = (mockStats.totalVotes / mockStats.totalVoters) * 100;
  const leadingCandidate = mockStats.candidates.reduce((prev, current) => 
    prev.votes > current.votes ? prev : current
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">নির্বাচনী পরিসংখ্যান</h2>
        <p className="text-muted-foreground">রিয়েল-টাইম ভোট গণনা এবং বিশ্লেষণ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ভোট</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalVotes.toLocaleString('bn-BD')}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.totalVoters.toLocaleString('bn-BD')} জন ভোটারের মধ্যে
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ভোটার উপস্থিতি</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{turnoutPercentage.toFixed(1)}%</div>
            <Progress value={turnoutPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">শীর্ষ প্রার্থী</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{leadingCandidate.name}</div>
            <p className="text-sm text-muted-foreground">{leadingCandidate.party}</p>
            <Badge className="mt-2" style={{ backgroundColor: leadingCandidate.color }}>
              {leadingCandidate.votes.toLocaleString('bn-BD')} ভোট
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ward" data-testid="tab-ward">ওয়ার্ড</TabsTrigger>
          <TabsTrigger value="district" data-testid="tab-district">জেলা</TabsTrigger>
          <TabsTrigger value="division" data-testid="tab-division">বিভাগ</TabsTrigger>
          <TabsTrigger value="national" data-testid="tab-national">জাতীয়</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedLevel} className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ভোট বিতরণ</CardTitle>
              <CardDescription>প্রার্থী অনুযায়ী ভোটের সংখ্যা</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStats.candidates.map((candidate) => {
                const percentage = (candidate.votes / mockStats.totalVotes) * 100;
                return (
                  <div key={candidate.hashId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: candidate.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{candidate.votes.toLocaleString('bn-BD')}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" style={{ 
                      '--progress-background': candidate.color 
                    } as React.CSSProperties} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
