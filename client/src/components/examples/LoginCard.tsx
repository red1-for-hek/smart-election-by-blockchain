import { LoginCard } from '../LoginCard';

export default function LoginCardExample() {
  const handleLogin = (nid: string, password: string) => {
    console.log('Login attempted:', { nid, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginCard onLogin={handleLogin} />
    </div>
  );
}
