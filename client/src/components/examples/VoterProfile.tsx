import { VoterProfile } from '../VoterProfile';

export default function VoterProfileExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <VoterProfile
          name="মোহাম্মদ রহিম"
          nameEn="Mohammad Rahim"
          nid="1234567890"
          address="মিরপুর, ঢাকা-১২১৬, বাংলাদেশ"
          mobile="+৮৮০১৭১২৩৪৫৬৭৮"
          hasVoted={true}
          registrationDate="১৫ জানুয়ারি ২০২৪"
          pollingCenter="মিরপুর সরকারি উচ্চ বিদ্যালয়, ওয়ার্ড নং ৩"
        />
      </div>
    </div>
  );
}
