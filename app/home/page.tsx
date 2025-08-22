"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Activity, 
  Server, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Download, 
  Upload,
  Bell,
  Settings,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Monitor,
  Router,
  Shield,
  Zap,
  Globe,
  BarChart3,
  PieChart,
  MapPin,
  Eye,
  Terminal,
  Database,
  Cloud,
  Home,
  Network
} from "lucide-react";

export default function CleanNetworkDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [networkData, setNetworkData] = useState({
    totalDevices: 127,
    onlineDevices: 124,
    offlineDevices: 3,
    criticalAlerts: 2,
    warnings: 8,
    bandwidth: {
      download: 850.5,
      upload: 234.8,
      peak: 1200.0
    },
    cpuUsage: 4,
    memoryUsage: 7,
    storageUsage: 23,
    networkLatency: 12,
    packetLoss: 0.02,
    throughput: 24,
    uptime: 9
  });

  const [trafficData, setTrafficData] = useState([]);
  const [topologyData] = useState([
    { name: 'Core Network', devices: 8, status: 'healthy', load: 23 },
    { name: 'Edge Routers', devices: 12, status: 'warning', load: 78 },
    { name: 'Access Switches', devices: 45, status: 'healthy', load: 45 },
    { name: 'Wireless APs', devices: 32, status: 'healthy', load: 67 },
    { name: 'Security Devices', devices: 6, status: 'healthy', load: 34 },
    { name: 'Servers', devices: 24, status: 'critical', load: 89 }
  ]);

  const [alerts] = useState([
    { id: 1, type: 'critical', device: 'SW-CORE-01', message: 'Alto uso de CPU (95%)', time: '14:32', location: 'Datacenter A', severity: 9 },
    { id: 2, type: 'warning', device: 'RT-EDGE-03', message: 'Latência elevada (120ms)', time: '14:15', location: 'Filial Norte', severity: 6 },
    { id: 3, type: 'critical', device: 'SV-DB-02', message: 'Perda de conectividade', time: '13:58', location: 'Datacenter B', severity: 10 },
    { id: 4, type: 'warning', device: 'SW-ACC-05', message: 'Porta com erro', time: '13:45', location: 'Andar 3', severity: 4 },
    { id: 5, type: 'info', device: 'FW-DMZ-01', message: 'Reinicialização programada', time: '13:30', location: 'DMZ', severity: 2 },
    { id: 6, type: 'warning', device: 'AP-WIFI-12', message: 'Sinal fraco detectado', time: '13:28', location: 'Sala 205', severity: 5 }
  ]);

  const [devices] = useState([
    { id: 1, name: 'SW-CORE-01', type: 'Switch', status: 'warning', ip: '192.168.1.1', uptime: '15d 4h', cpu: 95, memory: 78, location: 'DC-A', vendor: 'Cisco' },
    { id: 2, name: 'RT-EDGE-03', type: 'Router', status: 'warning', ip: '192.168.1.3', uptime: '8d 12h', cpu: 67, memory: 45, location: 'Edge', vendor: 'Juniper' },
    { id: 3, name: 'SV-DB-02', type: 'Server', status: 'offline', ip: '192.168.1.12', uptime: '0h', cpu: 0, memory: 0, location: 'DC-B', vendor: 'Dell' },
    { id: 4, name: 'FW-DMZ-01', type: 'Firewall', status: 'online', ip: '192.168.1.254', uptime: '32d 8h', cpu: 23, memory: 34, location: 'DMZ', vendor: 'Fortinet' },
    { id: 5, name: 'SW-ACC-05', type: 'Switch', status: 'warning', ip: '192.168.1.5', uptime: '12d 2h', cpu: 78, memory: 56, location: 'Floor-3', vendor: 'HP' },
    { id: 6, name: 'AP-WIFI-12', type: 'Access Point', status: 'online', ip: '192.168.2.12', uptime: '5d 8h', cpu: 34, memory: 23, location: 'Room-205', vendor: 'Ubiquiti' }
  ]);

  // Generate traffic data
  useEffect(() => {
    const generateTrafficData = () => {
      const data = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.getHours(),
          download: 600 + Math.sin(i * 0.5) * 200 + Math.random() * 100,
          upload: 200 + Math.sin(i * 0.3) * 80 + Math.random() * 50,
          latency: 10 + Math.random() * 15
        });
      }
      setTrafficData(data);
    };
    
    generateTrafficData();
    const interval = setInterval(generateTrafficData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(prev => ({
        ...prev,
        bandwidth: {
          ...prev.bandwidth,
          download: 800 + Math.random() * 200,
          upload: 200 + Math.random() * 100
        },
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLatency: Math.max(1, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 5)),
        throughput: Math.max(80, Math.min(100, prev.throughput + (Math.random() - 0.5) * 2))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': 
      case 'healthy': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'offline': 
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'Switch': return <Router className="w-4 h-4" />;
      case 'Router': return <Wifi className="w-4 h-4" />;
      case 'Server': return <Server className="w-4 h-4" />;
      case 'Firewall': return <Shield className="w-4 h-4" />;
      case 'Access Point': return <Zap className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const MetricCard = ({ title, value, unit, icon: Icon, trend, className = "", children }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {value}<span className="text-lg text-gray-500 ml-1">{unit}</span>
      </div>
      {children}
    </div>
  );

  const ProgressRing = ({ percentage, color, size = 80, strokeWidth = 6 }) => {
    const actualSize = typeof window !== 'undefined' && window.innerWidth < 640 ? Math.min(size, 60) : size;
    const radius = (actualSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative" style={{ width: actualSize, height: actualSize }}>
        <svg width={actualSize} height={actualSize} className="transform -rotate-90">
          <circle
            cx={actualSize / 2}
            cy={actualSize / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
          <circle
            cx={actualSize / 2}
            cy={actualSize / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg lg:text-xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  const NetworkMap = () => (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 h-64 sm:h-72">
      <div className="text-sm font-medium text-gray-700 mb-4 sm:mb-6">Topologia de Rede</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 h-full">
        {topologyData.map((segment, index) => (
          <div key={segment.name} className="flex flex-col items-center justify-center">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-2 flex items-center justify-center mb-2 sm:mb-3 ${getStatusColor(segment.status)}`}>
              <div className="text-sm sm:text-base lg:text-lg font-bold">{segment.devices}</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-700 text-center mb-1 sm:mb-2 px-1">{segment.name}</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  segment.load > 80 ? 'bg-red-500' : segment.load > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${segment.load}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{segment.load}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  const TrafficChart = () => (
    <div className="h-48 sm:h-56 lg:h-64 bg-gray-50 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="text-sm font-medium text-gray-700">Tráfego de Rede - 24h</div>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-emerald-600">Download</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-600">Upload</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
            <span className="text-purple-600">Latência</span>
          </div>
        </div>
      </div>
      <div className="flex items-end h-32 sm:h-36 lg:h-40 space-x-0.5 sm:space-x-1">
        {trafficData.map((data, i) => (
          <div key={i} className="flex-1 flex flex-col items-center space-y-1">
            <div className="flex flex-col space-y-0.5 sm:space-y-1 w-full">
              <div 
                className="bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm transition-all duration-500"
                style={{ height: `${(data.download / 1000) * (window.innerWidth < 640 ? 100 : 120)}px` }}
              ></div>
              <div 
                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm transition-all duration-500"
                style={{ height: `${(data.upload / 400) * (window.innerWidth < 640 ? 60 : 80)}px` }}
              ></div>
              <div 
                className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm transition-all duration-500"
                style={{ height: `${(data.latency / 25) * (window.innerWidth < 640 ? 30 : 40)}px` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">{data.time}h</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="flex items-center space-x-3">
              <div className=" flex items-center justify-center">
                <Image src="/logoleft12.png" width={200} height={200} alt={""} />
              </div> 
            </div>
            
            {/* Responsive Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {[
                { id: 'overview', label: 'Visão Geral', icon: Home },
                { id: 'devices', label: 'Dispositivos', icon: Monitor },
                { id: 'analytics', label: 'Análise', icon: BarChart3 },
                { id: 'topology', label: 'Topologia', icon: Globe }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overview">Visão Geral</option>
                <option value="devices">Dispositivos</option>
                <option value="analytics">Análise</option>
                <option value="topology">Topologia</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Status Indicators */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-medium">Sistema OK</span>
              </div>
              <div className="text-gray-400">
                <span className="hidden lg:inline">
                  {currentTime.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                  {' '}
                </span>
                <span className="text-cyan-400 font-medium">{currentTime.toLocaleTimeString('pt-BR')}</span>
              </div>
            </div>
            
            <button 
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 relative">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {networkData.criticalAlerts}
                </div>
              </button>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Responsive Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Dispositivos Online"
            value={networkData.onlineDevices}
            unit={`/${networkData.totalDevices}`}
            icon={CheckCircle}
            trend="up"
            className="border-l-4 border-l-emerald-500"
          >
            <div className="text-sm text-emerald-600 font-medium">
              {((networkData.onlineDevices / networkData.totalDevices) * 100).toFixed(1)}% disponibilidade
            </div>
          </MetricCard>
          
          <MetricCard
            title="Alertas Críticos"
            value={networkData.criticalAlerts}
            unit="ativos"
            icon={AlertTriangle}
            className="border-l-4 border-l-red-500"
          >
            <div className="text-sm text-red-600 font-medium">
              +{networkData.warnings} alertas de atenção
            </div>
          </MetricCard>
          
          <MetricCard
            title="Latência Média"
            value={networkData.networkLatency.toFixed(1)}
            unit="ms"
            icon={Zap}
            className="border-l-4 border-l-amber-500"
          >
            <div className="text-sm text-amber-600 font-medium">
              {networkData.packetLoss.toFixed(2)}% packet loss
            </div>
          </MetricCard>
          
          <MetricCard
            title="Throughput"
            value={networkData.throughput.toFixed(1)}
            unit="%"
            icon={TrendingUp}
            trend="up"
            className="border-l-4 border-l-blue-500"
          >
            <div className="text-sm text-blue-600 font-medium">
              Peak: {networkData.bandwidth.peak} Mbps
            </div>
          </MetricCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Responsive System Performance */}
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Performance do Sistema</h2>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              >
                <option value="1h">1 Hora</option>
                <option value="24h">24 Horas</option>
                <option value="7d">7 Dias</option>
                <option value="30d">30 Dias</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <div className="text-center">
                <ProgressRing percentage={networkData.cpuUsage} color="text-emerald-500" size={window.innerWidth < 100 ? 60 : 80} />
                <div className="text-sm text-gray-600 font-medium mt-3">CPU</div>
              </div>
              
              <div className="text-center">
                <ProgressRing percentage={networkData.memoryUsage} color="text-blue-500" size={window.innerWidth < 100 ? 60 : 80} />
                <div className="text-sm text-gray-600 font-medium mt-3">Memória</div>
              </div>
              
              <div className="text-center">
                <ProgressRing percentage={networkData.storageUsage} color="text-purple-500" size={window.innerWidth < 100 ? 60 : 80} />
                <div className="text-sm text-gray-600 font-medium mt-3">Armazenamento</div>
              </div>
              
              <div className="text-center">
                <ProgressRing percentage={networkData.throughput} color="text-cyan-500" size={window.innerWidth < 100 ? 60 : 80} />
                <div className="text-sm text-gray-600 font-medium mt-3">Rede</div>
              </div>
            </div>

            <TrafficChart />
          </div>

          {/* Responsive Alerts */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Alertas</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">LIVE</span>
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className={`border-l-4 pl-3 sm:pl-4 py-3 rounded-r-lg ${getStatusColor(alert.type)}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      {alert.type === 'critical' && <XCircle className="w-4 h-4 text-red-600" />}
                      {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {alert.type === 'info' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                      <span className="text-sm font-medium text-gray-900">{alert.device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        SEV-{alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{alert.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      
        {/* Responsive Device Status Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">Dispositivos Monitorados</h2>
            <div className="flex items-center space-x-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(device.status)}`}>
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{device.name}</span>
                      <div className="text-xs text-gray-500">{device.type}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                    {device.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">IP:</span>
                    <div className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs mt-1">{device.ip}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Local:</span>
                    <div className="text-gray-700 mt-1">{device.location}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">CPU:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            device.cpu > 80 ? 'bg-red-500' : device.cpu > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${device.cpu}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{device.cpu}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Memória:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            device.memory > 80 ? 'bg-red-500' : device.memory > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${device.memory}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{device.memory}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200">
                    <Terminal className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors duration-200">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600 py-3">Dispositivo</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">Tipo</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">IP</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">Localização</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">Uptime</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">CPU</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">Memória</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(device.status)}`}>
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">{device.name}</span>
                          <div className="text-xs text-gray-500">{device.vendor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-700">{device.type}</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(device.status)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${device.status === 'online' ? 'bg-emerald-500' : device.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'} ${device.status !== 'offline' ? 'animate-pulse' : ''}`}></div>
                        {device.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded font-mono">
                        {device.ip}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700">{device.location}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700">{device.uptime}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              device.cpu > 80 ? 'bg-red-500' : device.cpu > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${device.cpu}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 min-w-[3rem]">{device.cpu}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              device.memory > 80 ? 'bg-red-500' : device.memory > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${device.memory}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 min-w-[3rem]">{device.memory}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200" title="Ver detalhes">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200" title="Terminal">
                          <Terminal className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors duration-200" title="Configurações">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Responsive Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Mostrando {devices.length} de {networkData.totalDevices} dispositivos
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:border-gray-400 transition-colors duration-200">
                Anterior
              </button>
              <div className="flex space-x-1">
                <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="w-8 h-8 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">2</button>
                <button className="w-8 h-8 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">3</button>
              </div>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:border-gray-400 transition-colors duration-200">
                Próximo
              </button>
            </div>
          </div>
        </div>

        
      </main>  
            

      {/* Clean Footer */}
      <footer className="mt-12 border-t border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>© 2024 Network Monitor v2.4.1</span>
            <span>•</span>
            <span>Última atualização: {currentTime.toLocaleTimeString('pt-BR')}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Sistema Online</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Monitorando {networkData.totalDevices} dispositivos</span>
            <span>•</span>
            <span>Uptime: {networkData.uptime}%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}