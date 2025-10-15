import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CreditCard, MapPin, Phone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const userProfile = {
    name: "রেদওয়ানুল হক",
    nid: "1234567890",
    division: "রাজশাহী",
    district: "বগুড়া",
    upazila: "আদমদিঘী",
    ward: "৫",
    address: "বাড়ি নং ১২, রোড নং ৩, আদমদিঘী",
    phone: "+৮৮০১৭১২৩৪৫৬৭৮",
    accountType: "ভোটার অ্যাকাউন্ট",
    isExpatriate: false,
    passportNumber: "",
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">প্রোফাইল</h2>
          <p className="text-muted-foreground">আপনার সম্পূর্ণ তথ্য</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            ব্যক্তিগত তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">পূর্ণ নাম</p>
              <p className="font-semibold" data-testid="text-profile-name">{userProfile.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">অ্যাকাউন্ট ধরন</p>
              <Badge variant="outline" data-testid="badge-profile-account-type">{userProfile.accountType}</Badge>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">NID নম্বর</p>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <code className="font-mono font-semibold" data-testid="text-profile-nid">{userProfile.nid}</code>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">মোবাইল নম্বর</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold" data-testid="text-profile-phone">{userProfile.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            ঠিকানা
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">বিভাগ</p>
              <p className="font-semibold" data-testid="text-profile-division">{userProfile.division}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">জেলা</p>
              <p className="font-semibold" data-testid="text-profile-district">{userProfile.district}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">উপজেলা</p>
              <p className="font-semibold" data-testid="text-profile-upazila">{userProfile.upazila}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">ওয়ার্ড নম্বর</p>
              <p className="font-semibold" data-testid="text-profile-ward">{userProfile.ward}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">সম্পূর্ণ ঠিকানা</p>
              <p className="font-semibold" data-testid="text-profile-address">{userProfile.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {userProfile.isExpatriate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              প্রবাসী তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground mb-1">পাসপোর্ট/IC নম্বর</p>
              <code className="font-mono font-semibold">{userProfile.passportNumber}</code>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
