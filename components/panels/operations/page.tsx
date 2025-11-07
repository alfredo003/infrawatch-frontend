'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function OperationsPage() {
  const [selectedOperation, setSelectedOperation] = useState(null);

  const operations = [
    {
      id: 'OP-OMEGA-001',
      name: 'PROTOCOLO SOMBRA',
      status: 'ativa',
      priority: 'crítica',
      location: 'Leste Europeu',
      agents: 5,
      progress: 75,
      startDate: '2025-06-15',
      estimatedCompletion: '2025-06-30',
      description: 'Rastrear alvo de alto valor no Leste Europeu',
      objectives: [
        'Localizar alvo',
        'Estabelecer vigilância',
        'Extrair inteligência',
      ],
    },
    {
      id: 'OP-DELTA-002',
      name: 'FOGO FANTASMA',
      status: 'planejamento',
      priority: 'alta',
      location: 'Seul',
      agents: 3,
      progress: 25,
      startDate: '2025-06-20',
      estimatedCompletion: '2025-07-05',
      description: 'Infiltrar rede de cibercrime em Seul',
      objectives: [
        'Penetrar rede',
        'Coletar evidências',
        'Identificar jogadores-chave',
      ],
    },
    {
      id: 'OP-SIERRA-003',
      name: 'CAÇADOR NOTURNO',
      status: 'completada',
      priority: 'média',
      location: 'Berlim',
      agents: 2,
      progress: 100,
      startDate: '2025-05-28',
      estimatedCompletion: '2025-06-12',
      description: 'Monitorar comunicações de agente desonesto em Berlim',
      objectives: [
        'Interceptar comunicações',
        'Decodificar mensagens',
        'Relatar descobertas',
      ],
    },
    {
      id: 'OP-ALPHA-004',
      name: 'MARÉ CARMESIM',
      status: 'ativa',
      priority: 'alta',
      location: 'Cairo',
      agents: 4,
      progress: 60,
      startDate: '2025-06-10',
      estimatedCompletion: '2025-06-25',
      description: 'Apoiar extração secreta na América do Sul',
      objectives: [
        'Proteger ponto de extração',
        'Neutralizar ameaças',
        'Extrair ativo',
      ],
    },
    {
      id: 'OP-BRAVO-005',
      name: 'LÂMINA SILENCIOSA',
      status: 'comprometida',
      priority: 'crítica',
      location: 'Moscou',
      agents: 6,
      progress: 40,
      startDate: '2025-06-05',
      estimatedCompletion: '2025-06-20',
      description: 'Monitorar comunicações de agente desonesto em Berlim',
      objectives: [
        'Avaliar comprometimento',
        'Extrair pessoal',
        'Controle de danos',
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativa':
        return 'bg-white/20 text-white';
      case 'planejamento':
        return 'bg-orange-500/20 text-orange-500';
      case 'completada':
        return 'bg-white/20 text-white';
      case 'comprometida':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-neutral-500/20 text-neutral-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'crítica':
        return 'bg-red-500/20 text-red-500';
      case 'alta':
        return 'bg-orange-500/20 text-orange-500';
      case 'média':
        return 'bg-neutral-500/20 text-neutral-300';
      case 'baixa':
        return 'bg-white/20 text-white';
      default:
        return 'bg-neutral-500/20 text-neutral-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativa':
        return <Target className="w-4 h-4" />;
      case 'planejamento':
        return <Clock className="w-4 h-4" />;
      case 'completada':
        return <CheckCircle className="w-4 h-4" />;
      case 'comprometida':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            CENTRO DE OPERAÇÕES
          </h1>
          <p className="text-sm text-neutral-400">
            Planejamento de missões e supervisão de execução
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Nova Operação
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Briefing da Missão
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  OPS ATIVAS
                </p>
                <p className="text-2xl font-bold text-white font-mono">23</p>
              </div>
              <Target className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  COMPLETADAS
                </p>
                <p className="text-2xl font-bold text-white font-mono">156</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  COMPROMETIDAS
                </p>
                <p className="text-2xl font-bold text-red-500 font-mono">2</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  TAXA DE SUCESSO
                </p>
                <p className="text-2xl font-bold text-white font-mono">94%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {operations.map((operation) => (
          <Card
            key={operation.id}
            className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedOperation(operation)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white tracking-wider">
                    {operation.name}
                  </CardTitle>
                  <p className="text-xs text-neutral-400 font-mono">
                    {operation.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(operation.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getStatusColor(operation.status)}>
                  {operation.status.toUpperCase()}
                </Badge>
                <Badge className={getPriorityColor(operation.priority)}>
                  {operation.priority.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-neutral-300">
                {operation.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <MapPin className="w-3 h-3" />
                  <span>{operation.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Users className="w-3 h-3" />
                  <span>{operation.agents} agents assigned</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span>Est. completion: {operation.estimatedCompletion}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Progress</span>
                  <span className="text-white font-mono">
                    {operation.progress}%
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${operation.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Operation Detail Modal */}
      {selectedOperation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">
                  {selectedOperation.name}
                </CardTitle>
                <p className="text-sm text-neutral-400 font-mono">
                  {selectedOperation.id}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedOperation(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                      STATUS DA OPERAÇÃO
                    </h3>
                    <div className="flex gap-2">
                      <Badge
                        className={getStatusColor(selectedOperation.status)}
                      >
                        {selectedOperation.status.toUpperCase()}
                      </Badge>
                      <Badge
                        className={getPriorityColor(selectedOperation.priority)}
                      >
                        {selectedOperation.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                      DETALHES DA MISSÃO
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Localização:</span>
                        <span className="text-white">
                          {selectedOperation.location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Agentes:</span>
                        <span className="text-white font-mono">
                          {selectedOperation.agents}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">
                          Data de Início:
                        </span>
                        <span className="text-white font-mono">
                          {selectedOperation.startDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">
                          Conclusão Est.:
                        </span>
                        <span className="text-white font-mono">
                          {selectedOperation.estimatedCompletion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                      PROGRESSO
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Conclusão</span>
                        <span className="text-white font-mono">
                          {selectedOperation.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-3">
                        <div
                          className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedOperation.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                      OBJETIVOS
                    </h3>
                    <div className="space-y-2">
                      {selectedOperation.objectives.map((objective, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-neutral-300">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                  DESCRIÇÃO
                </h3>
                <p className="text-sm text-neutral-300">
                  {selectedOperation.description}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Atualizar Status
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Ver Relatórios
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Atribuir Agentes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
