export interface ReportData {
    message: string;
    stats: {
        total_systems: string;
        total_incidents: string;
        total_downtime_minutes: string;
        sla_general: number;
        availability_general: number;
        mttr_avg_minutes: string;
        availability_by_connection: {
            ping: string;
            snmp: string;
        };
        criticity_distribution: {
            low: string;
            medium: string;
            high: string;
            critical: string;
        };
        performance_by_type: any[];
    };
    data: {
        systems: any[];
        metrics: any[];
        systemTypes: any[];
    };
}