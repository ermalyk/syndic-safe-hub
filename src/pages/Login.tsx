import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { mockApi } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

type LoginType = 'email' | 'password';

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { qrUrl, user } = await mockApi.loginWithEmail(email);
      setQrUrl(qrUrl);
      
      // Wait 5 seconds then redirect
      setTimeout(() => {
        dispatch(setUser(user));
        toast({
          title: t('auth.successLogin'),
          description: `${t('auth.welcome')}, ${user.name}!`,
        });
        navigate('/');
      }, 5000);
    } catch (error) {
      toast({
        title: t('auth.error'),
        description: error instanceof Error ? error.message : t('auth.errorOccurred'),
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await mockApi.login(email, password);
      dispatch(setUser(user));
      toast({
        title: t('auth.successLogin'),
        description: `${t('auth.welcome')}, ${user.name}!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: t('auth.error'),
        description: error instanceof Error ? error.message : t('auth.errorOccurred'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">PropManager</CardTitle>
          <CardDescription>{t('auth.propertyManagement')}</CardDescription>
        </CardHeader>
        <CardContent>
          {qrUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {t('auth.scanQrCode')}
              </p>
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG value={qrUrl} size={200} />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {t('auth.redirecting')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6">
                <Button
                  type="button"
                  variant={loginType === 'email' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setLoginType('email')}
                >
                  {t('auth.emailLogin')}
                </Button>
                <Button
                  type="button"
                  variant={loginType === 'password' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setLoginType('password')}
                >
                  {t('auth.passwordLogin')}
                </Button>
              </div>

              {loginType === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? `${t('common.loading')}...` : t('auth.submit')}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-password">{t('auth.email')}</Label>
                    <Input
                      id="email-password"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? `${t('common.loading')}...` : t('auth.login')}
                  </Button>
                </form>
              )}

              <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
                <p className="font-semibold text-foreground">{t('auth.testAccounts')}:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p><strong>{t('auth.syndicAccount')}:</strong> syndic@prop.bg{loginType === 'password' ? ' / syndic123' : ''}</p>
                  <p><strong>{t('auth.coOwnerAccount')}:</strong> owner@prop.bg{loginType === 'password' ? ' / owner123' : ''}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
