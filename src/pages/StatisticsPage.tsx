import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart3, Trophy, Users, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDivisions, getDistricts, getUpazilas } from "@/lib/bd-geo-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const nationalData = [
  { name: "Jamaat-e-Islami", value: 45000, color: "#2D8B3C" },
  { name: "BNP", value: 32000, color: "#FF8C00" },
  { name: "NCP", value: 18000, color: "#4169E1" },
  { name: "Jatiya Party", value: 15000, color: "#DC143C" },
];

const divisionData: Record<string, typeof nationalData> = {
  "রাজশাহী": [
    { name: "Jamaat-e-Islami", value: 12000, color: "#2D8B3C" },
    { name: "BNP", value: 8500, color: "#FF8C00" },
    { name: "NCP", value: 4500, color: "#4169E1" },
    { name: "Jatiya Party", value: 3000, color: "#DC143C" },
  ],
  "ঢাকা": [
    { name: "BNP", value: 15000, color: "#FF8C00" },
    { name: "Jamaat-e-Islami", value: 14000, color: "#2D8B3C" },
    { name: "NCP", value: 8000, color: "#4169E1" },
    { name: "Jatiya Party", value: 6000, color: "#DC143C" },
  ],
  "চট্টগ্রাম": [
    { name: "BNP", value: 11000, color: "#FF8C00" },
    { name: "Jamaat-e-Islami", value: 9500, color: "#2D8B3C" },
    { name: "NCP", value: 3500, color: "#4169E1" },
    { name: "Jatiya Party", value: 2800, color: "#DC143C" },
  ],
  "খুলনা": [
    { name: "Jamaat-e-Islami", value: 6000, color: "#2D8B3C" },
    { name: "BNP", value: 4800, color: "#FF8C00" },
    { name: "NCP", value: 1500, color: "#4169E1" },
    { name: "Jatiya Party", value: 1200, color: "#DC143C" },
  ],
  "সিলেট": [
    { name: "BNP", value: 5500, color: "#FF8C00" },
    { name: "Jamaat-e-Islami", value: 4200, color: "#2D8B3C" },
    { name: "NCP", value: 800, color: "#4169E1" },
    { name: "Jatiya Party", value: 500, color: "#DC143C" },
  ],
  "বরিশাল": [
    { name: "Jamaat-e-Islami", value: 3800, color: "#2D8B3C" },
    { name: "BNP", value: 3200, color: "#FF8C00" },
    { name: "Jatiya Party", value: 1000, color: "#DC143C" },
    { name: "NCP", value: 700, color: "#4169E1" },
  ],
  "রংপুর": [
    { name: "Jamaat-e-Islami", value: 4200, color: "#2D8B3C" },
    { name: "BNP", value: 3800, color: "#FF8C00" },
    { name: "NCP", value: 1200, color: "#4169E1" },
    { name: "Jatiya Party", value: 800, color: "#DC143C" },
  ],
  "ময়মনসিংহ": [
    { name: "BNP", value: 4500, color: "#FF8C00" },
    { name: "Jamaat-e-Islami", value: 4100, color: "#2D8B3C" },
    { name: "NCP", value: 1300, color: "#4169E1" },
    { name: "Jatiya Party", value: 900, color: "#DC143C" },
  ],
};

const districtData: Record<string, typeof nationalData> = {
  "বগুড়া": [
    { name: "Jamaat-e-Islami", value: 5000, color: "#2D8B3C" },
    { name: "BNP", value: 3500, color: "#FF8C00" },
    { name: "NCP", value: 1800, color: "#4169E1" },
    { name: "Jatiya Party", value: 1200, color: "#DC143C" },
  ],
  "নাটোর": [
    { name: "Jamaat-e-Islami", value: 4200, color: "#2D8B3C" },
    { name: "BNP", value: 3000, color: "#FF8C00" },
    { name: "NCP", value: 1500, color: "#4169E1" },
    { name: "Jatiya Party", value: 1000, color: "#DC143C" },
  ],
  "ঢাকা": [
    { name: "BNP", value: 8000, color: "#FF8C00" },
    { name: "Jamaat-e-Islami", value: 7500, color: "#2D8B3C" },
    { name: "NCP", value: 4500, color: "#4169E1" },
    { name: "Jatiya Party", value: 3500, color: "#DC143C" },
  ],
  "চট্টগ্রাম": [
    { name: "BNP", value: 6000, color: "#FF8C00" },
    { name: "Jamaat-e-Islami", value: 5200, color: "#2D8B3C" },
    { name: "NCP", value: 2000, color: "#4169E1" },
    { name: "Jatiya Party", value: 1500, color: "#DC143C" },
  ],
};

export default function StatisticsPage() {
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    setSelectedDistrict("");
    setDistricts(getDistricts(value));
    setUpazilas([]);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setUpazilas(getUpazilas(selectedDivision, value));
  };

  const filteredData = selectedDistrict && districtData[selectedDistrict]
    ? districtData[selectedDistrict]
    : selectedDivision && divisionData[selectedDivision]
      ? divisionData[selectedDivision]
      : nationalData;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          ভোটের পরিসংখ্যান
        </h2>
        <p className="text-muted-foreground">রিয়েল-টাইম ইলেকশন রেজাল্ট</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              মোট ভোট
            </CardTitle>
            <CardDescription>
              {selectedDistrict ? `${selectedDistrict} জেলার জন্য` : selectedDivision ? `${selectedDivision} বিভাগের জন্য` : "সম্পূর্ণ দেশের জন্য"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold" data-testid="text-total-votes">
              {filteredData.reduce((sum, party) => sum + party.value, 0).toLocaleString('bn-BD')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">ব্লকচেইনে যাচাইকৃত ভোট</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              শীর্ষ দল
            </CardTitle>
            <CardDescription>সবচেয়ে বেশি ভোট পেয়েছে</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const sortedData = [...filteredData].sort((a, b) => b.value - a.value);
              const leadingParty = sortedData[0];
              const totalVotes = filteredData.reduce((sum, party) => sum + party.value, 0);
              
              return (
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full"
                    style={{ backgroundColor: leadingParty.color }}
                  />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-leading-party">{leadingParty.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {leadingParty.value.toLocaleString('bn-BD')} ভোট ({((leadingParty.value / totalVotes) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            ফিল্টার করুন
          </CardTitle>
          <CardDescription>নির্দিষ্ট এলাকার ফলাফল দেখুন</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>বিভাগ অনুযায়ী</Label>
              <Select value={selectedDivision} onValueChange={handleDivisionChange}>
                <SelectTrigger data-testid="select-stats-division">
                  <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {getDivisions().map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>জেলা অনুযায়ী</Label>
              <Select 
                value={selectedDistrict} 
                onValueChange={handleDistrictChange}
                disabled={!selectedDivision}
              >
                <SelectTrigger data-testid="select-stats-district">
                  <SelectValue placeholder="জেলা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>দলওয়ারী ভোটের বিতরণ</CardTitle>
          <CardDescription>
            {selectedDivision && selectedDistrict 
              ? `${selectedDivision} → ${selectedDistrict} এর ফলাফল`
              : selectedDivision 
                ? `${selectedDivision} বিভাগের ফলাফল`
                : "সম্পূর্ণ দেশের ফলাফল"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => value.toLocaleString('bn-BD')}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((party) => {
              const totalVotes = filteredData.reduce((sum, p) => sum + p.value, 0);
              return (
                <div 
                  key={party.name} 
                  className="flex items-center justify-between p-3 rounded-lg border"
                  data-testid={`stats-${party.name}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                    <span className="font-medium">{party.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{party.value.toLocaleString('bn-BD')}</p>
                    <p className="text-sm text-muted-foreground">
                      {((party.value / totalVotes) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
