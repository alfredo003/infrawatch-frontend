"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { listAllSystems, SystemData } from "@/services/systemService";

// Importa react-apexcharts só no cliente
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartSeries = {
  name: string;
  data: number[];
};

type ChartState = {
  options: any;
  series: ChartSeries[];
};

// Função fetcher para o SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ChartV = () => {
  const [series, setSeries] = useState<ChartSeries[]>([
    {
      name: "Disponibilidade",
      data: Array.from({ length: 61 }, () => 0), // Inicializa com 0%
    },
  ]);

  const options = {
    dataLabels: {
      enabled: false,
    },
    chart: {
      id: "systems-availability",
    },
    xaxis: {
      categories: Array.from({ length: 61 }, (_, i) => i),
      labels: {
        formatter: function (val: number) {
          if ([0, 10, 20, 30, 40, 50, 60].includes(val)) {
            return `${60 - val}s`;
          }
          return "";
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: "Disponibilidade (%)",
      },
      labels: {
        formatter: (val: number) => `${val.toFixed(0)}%`,
      },
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  };

  
 
  const { data, error } = useSWR<SystemData[]>("systems", listAllSystems, {
       refreshInterval: 500,
      });

      let total = data?.length;
      let up = data?.filter((s) => s.status === "up").length;
 
  useEffect(() => {
    if (data) {
      const percentage = total > 0 ? (up / total) * 100 : 0;
      setSeries((prevSeries) => {
        const newSeries = prevSeries.map((s) => {
          const newData = [...s.data];
          newData.shift();  
          newData.push(percentage); 
          return { ...s, data: newData };
        });
        return newSeries;
      });
    }
  }, [data]);

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          
          {error && <p>Erro ao carregar dados: {error.message}</p>}
          <Chart options={options} series={series} type="area" height={500} />
        </div>
      </div>
    </div>
  );
};

export default ChartV;