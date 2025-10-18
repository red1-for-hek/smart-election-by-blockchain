import { Globe, Clock, MapPin, Plane } from "lucide-react";

export default function PostalPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Plane className="h-8 w-8 text-blue-600" />
            Postal Voting
          </h2>
          <p className="text-gray-600">প্রবাসী ভোটারদের জন্য বিশেষ ভোটিং</p>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
          <Globe className="h-4 w-4" />
          আন্তর্জাতিক
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-blue-800">
              <strong>বিশেষ নোট:</strong> প্রবাসী ভোটারদের জন্য ফটো যাচাইকরণ বাধ্যতামূলক। আপনার পাসপোর্ট/IC সাথে রাখুন।
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-2">সময় অঞ্চল তথ্য</h3>
        <p className="text-gray-600 mb-4">আপনার স্থানীয় সময়ে ভোট দিতে পারবেন</p>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <p className="font-medium">বর্তমান সময়: {new Date().toLocaleString('bn-BD')}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">প্রবাসী ভোটিং প্রক্রিয়া</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="font-medium">পরিচয় যাচাই</h4>
              <p className="text-gray-600 text-sm">NID + পাসপোর্ট/IC + ফেস ভেরিফিকেশন</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="font-medium">ভোট প্রদান</h4>
              <p className="text-gray-600 text-sm">আপনার পছন্দের প্রার্থী নির্বাচন করুন</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="font-medium">নিশ্চিতকরণ</h4>
              <p className="text-gray-600 text-sm">ব্লকচেইনে ভোট রেকর্ড এবং রসিদ প্রাপ্তি</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          প্রবাসী ভোট শুরু করুন
        </button>
      </div>
    </div>
  );
}