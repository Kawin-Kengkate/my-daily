import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sticker } from '@/components/Sticker';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const { signInGoogle, loading } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <Card className="w-full max-w-sm p-8 text-center">
        <div className="flex justify-center mb-6 mt-2">
          <Logo size="lg" />
        </div>
        <h1 className="font-display font-extrabold text-display tracking-tight">My Daily</h1>
        <p className="font-body text-ink-500 mt-2">บันทึก daily log + คำนวณ OT</p>
        <div className="mt-4 flex justify-center">
          <Sticker color="rose">whitelisted: kawin only</Sticker>
        </div>
        <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => signInGoogle()} disabled={loading}>
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
}
