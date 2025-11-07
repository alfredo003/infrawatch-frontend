import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CompanyInfo {
  name: string;
  logo?: string;
  industry: string;
  foundedYear: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  employeeCount: number;
  status: 'active' | 'inactive';
}

interface CompanyInfoHorizontalProps {
  companyData?: CompanyInfo;
}

const defaultCompanyData: CompanyInfo = {
  name: 'Empresa Exemplo',
  industry: 'Tecnologia',
  foundedYear: '2020',
  address: 'Luanda, Angola',
  phone: '+244 923 456 789',
  email: 'contato@empresa.ao',
  website: 'www.empresa.ao',
  employeeCount: 150,
  status: 'active',
};

export default function CompanyInfoHorizontal({
  companyData = defaultCompanyData,
}: CompanyInfoHorizontalProps) {
  const data = companyData || defaultCompanyData;

  return (
    <Card className="shadow-lg border-0 bg-white w-full">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {data.logo ? (
              <img
                src={data.logo}
                alt={data.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl font-bold">{data.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={
                    data.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {data.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Endereço */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Endereço</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {data.address}
              </p>
            </div>
          </div>

          {/* Telefone */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Telefone</p>
              <a
                href={`tel:${data.phone}`}
                className="text-sm font-semibold text-primary hover:underline mt-1 block"
              >
                {data.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Mail className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <a
                href={`mailto:${data.email}`}
                className="text-sm font-semibold text-primary hover:underline mt-1 block break-all"
              >
                {data.email}
              </a>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <Globe className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Website</p>
              <a
                href={`https://${data.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline mt-1 block break-all"
              >
                {data.website}
              </a>
            </div>
          </div>

          {/* Funcionários */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Total de Equipe
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {data.employeeCount} pessoas
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
