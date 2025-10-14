import {  EthernetPort, MapPinned, Monitor, PrinterCheck, Server, ServerCrash, Settings, Shield, Target, Unplug } from "lucide-react";

export  const menuItems = [
    { id: 0, icon: Monitor, label: "DASHBOARD",status:'all' },  
    { id: 1, icon: EthernetPort , label: "MONITORAMENTO",status:'all'  },
    { id: 2, icon: ServerCrash, label: "SISTEMAS",status:'all'  },
    { id: 3, icon: Unplug , label: "INTEGRAÇÕES",status:'all'  },
    { id: 6, icon: MapPinned , label: "GEOMAP",status:'all'  },
    { id: 7, icon: PrinterCheck , label: "RELATÓRIOS" },
    { id: 8, icon: Settings, label: "CONFIGURAÇÕES" },
  ];

  export  const menuItemsOperator = [
    { id: 0, icon: Monitor, label: "DASHBOARD",status:'all' },  
    { id: 1, icon: EthernetPort , label: "MONITORAMENTO",status:'all'  },
    { id: 2, icon: ServerCrash, label: "SISTEMAS",status:'all'  },
    { id: 3, icon: Unplug , label: "INTEGRAÇÕES",status:'all'  },
    { id: 6, icon: MapPinned , label: "GEOMAP",status:'all'  },
    { id: 7, icon: PrinterCheck , label: "RELATÓRIOS" }
  ];

  export  const menuItemsViewer = [
    { id: 0, icon: Monitor, label: "DASHBOARD",status:'all' },  
    { id: 1, icon: EthernetPort , label: "MONITORAMENTO",status:'all'  }, 
    { id: 3, icon: Unplug , label: "INTEGRAÇÕES",status:'all'  },
    { id: 6, icon: MapPinned , label: "GEOMAP",status:'all'  }
  ];