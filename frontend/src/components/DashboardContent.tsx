import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  BookPlus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts/es6";
import { useBooks } from "@/hooks/useBooks";
import { useStudents } from "@/hooks/useStudents";
import { useBookIssues, useOverdueBookIssues } from "@/hooks/useBookIssues";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/error-alert";

export function DashboardContent() {
  const { books = [], isLoading: isLoadingBooks, error: booksError } = useBooks();
  const { students = [], isLoading: isLoadingStudents, error: studentsError } = useStudents();
  const { bookIssues = [], isLoading: isLoadingIssues, error: issuesError } = useBookIssues();
  const { data: overdueIssues = [], isLoading: isLoadingOverdue, error: overdueError } = useOverdueBookIssues();

  console.log('DashboardContent: Overdue issues:', overdueIssues);
  console.log('DashboardContent: Loading states:', {
    books: isLoadingBooks,
    students: isLoadingStudents,
    issues: isLoadingIssues,
    overdue: isLoadingOverdue
  });
  console.log('DashboardContent: Errors:', {
    books: booksError,
    students: studentsError,
    issues: issuesError,
    overdue: overdueError
  });

  const isLoading = isLoadingBooks || isLoadingStudents || isLoadingIssues || isLoadingOverdue;
  const error = booksError || studentsError || issuesError || overdueError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message="Failed to load dashboard data" />;
  }

  const stats = [
    {
      title: "Total Books",
      value: books.length,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Books Issued",
      value: bookIssues.filter(issue => issue.status === 'issued').length,
      icon: BookPlus,
      color: "text-purple-600",
    },
    {
      title: "Overdue Books",
      value: overdueIssues.length,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-gray-500">
                {stat.title === "Total Books" && "in library collection"}
                {stat.title === "Total Students" && "registered members"}
                {stat.title === "Books Issued" && "currently issued"}
                {stat.title === "Overdue Books" && "need attention"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookIssues}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="issue_date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="status" fill="#3b82f6" name="Books Issued" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Book Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { status: 'Issued', count: bookIssues.filter(i => i.status === 'issued').length },
                    { status: 'Overdue', count: overdueIssues.length },
                    { status: 'Returned', count: bookIssues.filter(i => i.status === 'returned').length }
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="status" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" name="Books" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookIssues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{issue.book?.title || 'Unknown Book'}</p>
                  <p className="text-sm text-gray-500">
                    {issue.status === 'returned' ? 'Returned by' : 'Issued to'}: {issue.student?.name || 'Unknown Student'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(issue.issue_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <div className={`text-sm font-medium mb-1 ${
                    issue.status === 'overdue' 
                      ? 'text-red-600' 
                      : issue.status === 'returned' 
                      ? 'text-green-600' 
                      : 'text-blue-600'
                  }`}>
                    {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                  </div>
                  <p className="text-xs text-gray-400">
                    Due: {new Date(issue.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {bookIssues.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
