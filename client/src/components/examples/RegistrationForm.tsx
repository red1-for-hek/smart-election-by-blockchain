import { RegistrationForm } from '../RegistrationForm';

export default function RegistrationFormExample() {
  const handleRegister = (data: any) => {
    console.log('Registration data:', data);
  };

  const handleBackToLogin = () => {
    console.log('Back to login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <RegistrationForm onRegister={handleRegister} onBackToLogin={handleBackToLogin} />
    </div>
  );
}
