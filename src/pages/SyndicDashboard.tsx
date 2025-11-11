import { MainLayout } from "@/components/Layout/MainLayout";
import { StatCard } from "@/components/Dashboard/StatCard";
import { Plus, Users, Calendar, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { mockApi, Assembly, AssemblyStats } from "@/services/mockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { CreateAssemblyDialog } from "@/components/CreateAssemblyDialog";

const SyndicDashboard = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [stats, setStats] = useState<AssemblyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { t } = useTranslation();

  const loadData = async () => {
    try {
      const [assembliesData, statsData] = await Promise.all([
        mockApi.getAssemblies(),
        mockApi.getAssemblyStats(),
      ]);
      setAssemblies(assembliesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssemblyCreated = () => {
    loadData();
  };

  const getStatusBadge = (status: Assembly['status']) => {
    const variants = {
      upcoming: { label: t('dashboard.status.upcoming'), className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
      active: { label: t('dashboard.status.active'), className: 'bg-green-500/10 text-green-600 border-green-500/20' },
      completed: { label: t('dashboard.status.completed'), className: 'bg-muted text-muted-foreground border-border' },
    };
    const variant = variants[status];
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('nav.assemblies')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('dashboard.description')}</p>
          </div>
          <Button 
            className="bg-gradient-to-br from-primary to-accent hover:opacity-90"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('dashboard.createAssembly')}
          </Button>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title={t('dashboard.totalAssemblies')}
              value={stats.totalAssemblies}
              icon={Calendar}
            />
            <StatCard
              title={t('dashboard.activeAssemblies')}
              value={stats.activeAssemblies}
              icon={FileText}
            />
            <StatCard
              title={t('dashboard.participants')}
              value={stats.totalParticipants}
              icon={Users}
            />
            <StatCard
              title={t('dashboard.avgParticipation')}
              value={stats.averageAttendance}
              icon={Users}
            />
          </div>
        ) : null}

        {/* Assemblies List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('dashboard.upcomingAssemblies')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {assemblies.map((assembly) => (
                  <div
                    key={assembly.id}
                    className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3 flex-wrap">
                          <h3 className="font-semibold text-foreground">{assembly.title}</h3>
                          {getStatusBadge(assembly.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{assembly.date} в {assembly.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{assembly.participantsCount} {t('dashboard.participants')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{assembly.delegatedOwnersCount} {t('dashboard.delegated')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          {t('dashboard.eventLog')}
                        </Button>
                        {assembly.status === 'active' && (
                          <Button variant="default" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            {t('dashboard.manage')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Assembly Dialog */}
        <CreateAssemblyDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleAssemblyCreated}
        />
      </div>
    </MainLayout>
  );
};

export default SyndicDashboard;
