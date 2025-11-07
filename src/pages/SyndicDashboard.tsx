import { MainLayout } from "@/components/Layout/MainLayout";
import { StatCard } from "@/components/Dashboard/StatCard";
import { Building2, Users, DollarSign, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-dashboard.jpg";

const SyndicDashboard = () => {
  const upcomingEvents = [
    { id: 1, title: "Годишно общо събрание 2025", date: "15 Януари 2025", type: "AGM" },
    { id: 2, title: "Ремонт на асансьор - Блок А", date: "20 Декември 2024", type: "Maintenance" },
    { id: 3, title: "Краен срок за плащане на такси Q4", date: "31 Декември 2024", type: "Payment" },
  ];

  const recentActivities = [
    { id: 1, action: "Подписан протокол от ОС", user: "Иван Петров", time: "Преди 2 часа" },
    { id: 2, action: "Ново плащане получено", user: "Мария Димитрова", time: "Преди 3 часа" },
    { id: 3, action: "Заявка за поддръжка създадена", user: "Георги Стоянов", time: "Преди 5 часа" },
    { id: 4, action: "Пълномощно делегирано", user: "Елена Николова", time: "Преди 1 ден" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative h-64 rounded-2xl overflow-hidden">
          <img 
            src={heroImage} 
            alt="Dashboard Overview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80 flex items-center">
            <div className="px-8 text-white">
              <h1 className="text-4xl font-bold mb-2">Табло на Синдика</h1>
              <p className="text-lg opacity-90">Пълен контрол върху управлението на имота</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Общо съсобственици"
            value="156"
            icon={Users}
            trend={{ value: "+5 този месец", positive: true }}
          />
          <StatCard
            title="Събрани такси"
            value="€45,230"
            icon={DollarSign}
            trend={{ value: "+12.5%", positive: true }}
          />
          <StatCard
            title="Активни събития"
            value="8"
            icon={Calendar}
          />
          <StatCard
            title="Заявки за поддръжка"
            value="23"
            icon={TrendingUp}
            trend={{ value: "-3 от миналата седмица", positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Предстоящи събития
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Виж всички събития
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                Скорошна активност
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Виж цялата активност
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Бързи действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-24 flex flex-col gap-2 bg-gradient-to-br from-primary to-accent hover:opacity-90">
                <Calendar className="h-6 w-6" />
                <span>Планирай събрание</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Добави собственик</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                <span>Генерирай фактура</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Building2 className="h-6 w-6" />
                <span>Заявка поддръжка</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SyndicDashboard;
