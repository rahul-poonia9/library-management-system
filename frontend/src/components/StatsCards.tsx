
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { title: "Books", value: "1000", color: "text-blue-600" },
  { title: "Students", value: "500", color: "text-green-600" },
  { title: "Issued Books", value: "300", color: "text-purple-600" },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
