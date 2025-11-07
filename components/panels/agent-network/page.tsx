'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Clock,
  Shield,
} from 'lucide-react';

export default function AgentNetworkPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agents = [
    {
      id: 'G-078W',
      name: 'ESPÍRITO VINGATIVO',
      status: 'ativo',
      location: 'Berlim',
      lastSeen: '2 min ago',
      missions: 47,
      risk: 'alto',
    },
    {
      id: 'G-079X',
      name: 'SENTINELA OBSIDIANA',
      status: 'espera',
      location: 'Tóquio',
      lastSeen: '15 min ago',
      missions: 32,
      risk: 'médio',
    },
    {
      id: 'G-080Y',
      name: 'FÚRIA FANTASMA',
      status: 'ativo',
      location: 'Cairo',
      lastSeen: '1 min ago',
      missions: 63,
      risk: 'alto',
    },
    {
      id: 'G-081Z',
      name: 'VINGADOR MALDITO',
      status: 'comprometido',
      location: 'Moscou',
      lastSeen: '3 hours ago',
      missions: 28,
      risk: 'crítico',
    },
    {
      id: 'G-082A',
      name: 'SOMBRA VENENOSA',
      status: 'ativo',
      location: 'Londres',
      lastSeen: '5 min ago',
      missions: 41,
      risk: 'médio',
    },
    {
      id: 'G-083B',
      name: 'ENIGMA MÍSTICO',
      status: 'treinamento',
      location: 'Base Alfa',
      lastSeen: '1 day ago',
      missions: 12,
      risk: 'baixo',
    },
    {
      id: 'G-084C',
      name: 'VINGADOR ESPECTRAL',
      status: 'ativo',
      location: 'Paris',
      lastSeen: '8 min ago',
      missions: 55,
      risk: 'alto',
    },
    {
      id: 'G-085D',
      name: 'FÚRIA ESPECTRAL',
      status: 'espera',
      location: 'Sydney',
      lastSeen: '22 min ago',
      missions: 38,
      risk: 'médio',
    },
  ];

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            REDE DE AGENTES
          </h1>
          <p className="text-sm text-neutral-400">
            Gerenciar e monitorar operativos de campo
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Implantar Agente
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Buscar agentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  AGENTES ATIVOS
                </p>
                <p className="text-2xl font-bold text-white font-mono">847</p>
              </div>
              <Shield className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  COMPROMETIDOS
                </p>
                <p className="text-2xl font-bold text-red-500 font-mono">3</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  EM TREINAMENTO
                </p>
                <p className="text-2xl font-bold text-orange-500 font-mono">
                  23
                </p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent List */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            LISTA DE AGENTES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    ID DO AGENTE
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    CODINOME
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    LOCALIZAÇÃO
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    VISTO POR ÚLTIMO
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    MISSÕES
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    RISCO
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    AÇÕES
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent, index) => (
                  <tr
                    key={agent.id}
                    className={`border-b border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-850'
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <td className="py-3 px-4 text-sm text-white font-mono">
                      {agent.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-white">
                      {agent.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            agent.status === 'ativo'
                              ? 'bg-white'
                              : agent.status === 'espera'
                                ? 'bg-neutral-500'
                                : agent.status === 'treinamento'
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                          }`}
                        ></div>
                        <span className="text-xs text-neutral-300 uppercase tracking-wider">
                          {agent.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span className="text-sm text-neutral-300">
                          {agent.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span className="text-sm text-neutral-300 font-mono">
                          {agent.lastSeen}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-white font-mono">
                      {agent.missions}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${
                          agent.risk === 'crítico'
                            ? 'bg-red-500/20 text-red-500'
                            : agent.risk === 'alto'
                              ? 'bg-orange-500/20 text-orange-500'
                              : agent.risk === 'médio'
                                ? 'bg-neutral-500/20 text-neutral-300'
                                : 'bg-white/20 text-white'
                        }`}
                      >
                        {agent.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-orange-500"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-wider">
                  {selectedAgent.name}
                </CardTitle>
                <p className="text-sm text-neutral-400 font-mono">
                  {selectedAgent.id}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedAgent(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">
                    STATUS
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedAgent.status === 'ativo'
                          ? 'bg-white'
                          : selectedAgent.status === 'espera'
                            ? 'bg-neutral-500'
                            : selectedAgent.status === 'treinamento'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                      }`}
                    ></div>
                    <span className="text-sm text-white uppercase tracking-wider">
                      {selectedAgent.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">
                    LOCALIZAÇÃO
                  </p>
                  <p className="text-sm text-white">{selectedAgent.location}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">
                    MISSÕES COMPLETADAS
                  </p>
                  <p className="text-sm text-white font-mono">
                    {selectedAgent.missions}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">
                    NÍVEL DE RISCO
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${
                      selectedAgent.risk === 'crítico'
                        ? 'bg-red-500/20 text-red-500'
                        : selectedAgent.risk === 'alto'
                          ? 'bg-orange-500/20 text-orange-500'
                          : selectedAgent.risk === 'médio'
                            ? 'bg-neutral-500/20 text-neutral-300'
                            : 'bg-white/20 text-white'
                    }`}
                  >
                    {selectedAgent.risk}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Atribuir Missão
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Ver Histórico
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Enviar Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
