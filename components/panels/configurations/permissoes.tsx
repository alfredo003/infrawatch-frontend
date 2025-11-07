import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-select';
import { Edit, Eye, Settings, Shield, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

export default function Premission() {
  const [profileFilter, setProfileFilter] = useState<
    'all' | 'system' | 'custom'
  >('all');

  const handleProfileFilterClick = (filter: 'all' | 'system' | 'custom') => {
    setProfileFilter(filter);
    toast.success(
      `Filtro aplicado: ${filter === 'all' ? 'Todos os perfis' : filter === 'system' ? 'Perfis do sistema' : 'Perfis personalizados'}`,
    );
  };
  return (
    <>
      {/* Statistics Cards for Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`bg-card border-border hover-blue cursor-pointer transition-all ${profileFilter === 'system' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => handleProfileFilterClick('system')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">
                  SISTEMA
                </p>
                <p className="text-2xl font-bold text-primary font-mono">
                  {profileStats.systemProfiles}
                </p>
              </div>
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-card border-border hover-blue cursor-pointer transition-all ${profileFilter === 'custom' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => handleProfileFilterClick('custom')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">
                  PERSONALIZADOS
                </p>
                <p className="text-2xl font-bold text-green-500 font-mono">
                  {profileStats.customProfiles}
                </p>
              </div>
              <Settings className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">
                  USUÁRIOS
                </p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {profileStats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profiles List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProfiles.map((profile) => (
          <Card
            key={profile.id}
            className="bg-card border-border hover-blue cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handleViewProfile(profile)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground tracking-wider">
                      {profile.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {profile.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {profile.isSystem && (
                    <Badge className="bg-primary/20 text-primary text-xs">
                      SISTEMA
                    </Badge>
                  )}
                  <Badge className="bg-muted text-muted-foreground text-xs">
                    {profile.userCount} usuários
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground text-sm font-medium uppercase tracking-wide mb-2 block">
                    PERMISSÕES ({profile.permissions.length})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.permissions.slice(0, 6).map((permissionId) => {
                      const permission = permissions.find(
                        (p) => p.id === permissionId,
                      );
                      return (
                        <Badge
                          key={permissionId}
                          className="bg-muted/50 text-muted-foreground text-xs flex items-center gap-1"
                        >
                          {permission?.icon}
                          {permission?.name}
                        </Badge>
                      );
                    })}
                    {profile.permissions.length > 6 && (
                      <Badge className="bg-muted/50 text-muted-foreground text-xs">
                        +{profile.permissions.length - 6} mais
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Criado em:{' '}
                    {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewProfile(profile)}
                      className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!profile.isSystem && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditProfile(profile)}
                          className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-500 hover-blue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
