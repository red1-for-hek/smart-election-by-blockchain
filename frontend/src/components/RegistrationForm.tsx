import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserPlus } from "lucide-react";
import { getDivisions, getDistricts, getUpazilas } from "@/lib/bd-geo-data";

interface RegistrationFormProps {
  onRegister: (data: RegistrationData) => void;
  onBackToLogin: () => void;
}

export interface RegistrationData {
  name: string;
  nid: string;
  division: string;
  district: string;
  upazila: string;
  ward: string;
  address: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isExpatriate: boolean;
  passportNumber?: string;
}

export function RegistrationForm({ onRegister, onBackToLogin }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    nid: "",
    division: "",
    district: "",
    upazila: "",
    ward: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isExpatriate: false,
    passportNumber: "",
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  const handleDivisionChange = (value: string) => {
    setFormData({ ...formData, division: value, district: "", upazila: "" });
    setDistricts(getDistricts(value));
    setUpazilas([]);
  };

  const handleDistrictChange = (value: string) => {
    setFormData({ ...formData, district: value, upazila: "" });
    setUpazilas(getUpazilas(formData.division, value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("পাসওয়ার্ড মিলছে না");
      return;
    }
    
    onRegister(formData);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">নিবন্ধন করুন</h1>
            <p className="text-sm text-muted-foreground">Register for Voting</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">নতুন ভোটার নিবন্ধন</CardTitle>
          <CardDescription>আপনার তথ্য দিয়ে নিবন্ধন সম্পন্ন করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">পূর্ণ নাম *</Label>
                <Input
                  id="name"
                  placeholder="আপনার পূর্ণ নাম"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nid">জাতীয় পরিচয়পত্র নম্বর (NID) *</Label>
                <Input
                  id="nid"
                  type="text"
                  placeholder="১০ বা ১৭ ডিজিটের NID"
                  value={formData.nid}
                  onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                  data-testid="input-nid"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">বিভাগ *</Label>
                <Select value={formData.division} onValueChange={handleDivisionChange} required>
                  <SelectTrigger id="division" data-testid="select-division">
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
                <Label htmlFor="district">জেলা *</Label>
                <Select 
                  value={formData.district} 
                  onValueChange={handleDistrictChange} 
                  disabled={!formData.division}
                  required
                >
                  <SelectTrigger id="district" data-testid="select-district">
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

              <div className="space-y-2">
                <Label htmlFor="upazila">উপজেলা *</Label>
                <Select 
                  value={formData.upazila} 
                  onValueChange={(value) => setFormData({ ...formData, upazila: value })}
                  disabled={!formData.district}
                  required
                >
                  <SelectTrigger id="upazila" data-testid="select-upazila">
                    <SelectValue placeholder="উপজেলা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {upazilas.map((upazila) => (
                      <SelectItem key={upazila} value={upazila}>
                        {upazila}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward">ওয়ার্ড নম্বর *</Label>
                <Input
                  id="ward"
                  type="text"
                  placeholder="ওয়ার্ড নম্বর"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  data-testid="input-ward"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">বাড়ির ঠিকানা *</Label>
              <Input
                id="address"
                placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                data-testid="input-address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+৮৮০১৭XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="input-phone"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="সুরক্ষিত পাসওয়ার্ড তৈরি করুন"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  data-testid="input-password"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  data-testid="input-confirm-password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
              <Checkbox
                id="expatriate"
                checked={formData.isExpatriate}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isExpatriate: checked as boolean })
                }
                data-testid="checkbox-expatriate"
              />
              <Label htmlFor="expatriate" className="cursor-pointer">
                আমি প্রবাসী (বিদেশে বসবাসকারী)
              </Label>
            </div>

            {formData.isExpatriate && (
              <div className="space-y-2">
                <Label htmlFor="passport">পাসপোর্ট/IC নম্বর *</Label>
                <Input
                  id="passport"
                  placeholder="পাসপোর্ট বা IC নম্বর লিখুন"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  data-testid="input-passport"
                  required={formData.isExpatriate}
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" data-testid="button-register">
                <UserPlus className="mr-2 h-4 w-4" />
                নিবন্ধন সম্পন্ন করুন
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBackToLogin}
                data-testid="button-back-to-login"
              >
                লগইন পেজে ফিরুন
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>আপনার তথ্য ব্লকচেইনে সুরক্ষিত থাকবে</span>
      </div>
    </div>
  );
}
