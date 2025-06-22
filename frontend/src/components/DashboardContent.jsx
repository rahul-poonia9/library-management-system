import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts/es6";
import { useBooks } from "../hooks/useBooks.js";
import { useStudents } from "../hooks/useStudents.js";
import { useBookIssues, useOverdueBookIssues } from "../hooks/useBookIssues.js";
import { LoadingSpinner } from "./ui/loading-spinner";
import { ErrorAlert } from "./ui/error-alert";

// Helper function to get book categories data
const getBookCategoriesData = (books) => {
  console.log('Processing books for categories:', books);
  
  const categories = {};
  books.forEach(book => {
    const category = book.category || book.Category || 'Uncategorized';
    const quantity = parseInt(book.quantity) || 1;
    categories[category] = (categories[category] || 0) + quantity;
  });
  
  const result = Object.entries(categories).map(([name, count]) => ({
    name,
    count
  }));
  
  console.log('Categories result:', result);
  return result;
};

// Helper function to get daily activity data
const getDailyActivityData = (bookIssues) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const issued = bookIssues.filter(issue => {
      const issueDate = new Date(issue.issue_date);
      return issueDate.toDateString() === date.toDateString();
    }).length;
    
    const returned = bookIssues.filter(issue => {
      if (issue.status !== 'returned' || !issue.return_date) return false;
      const returnDate = new Date(issue.return_date);
      return returnDate.toDateString() === date.toDateString();
    }).length;
    
    days.push({
      date: dateStr,
      issued,
      returned
    });
  }
  return days;
};

export function DashboardContent() {
  const { books = [], isLoading: isLoadingBooks, error: booksError } = useBooks();
  const { students = [], isLoading: isLoadingStudents, error: studentsError } = useStudents();
  const { bookIssues = [], isLoading: isLoadingIssues, error: issuesError } = useBookIssues();
  const { data: overdueIssues = [], isLoading: isLoadingOverdue, error: overdueError } = useOverdueBookIssues();

  const isLoading = isLoadingBooks || isLoadingStudents || isLoadingIssues || isLoadingOverdue;
  const error = booksError || studentsError || issuesError || overdueError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message="Failed to load dashboard data" />;
  }

  const bookCategories = getBookCategoriesData(books);
  const dailyActivity = getDailyActivityData(bookIssues);
  
  // Debug logging
  console.log('Books data:', books);
  console.log('Book categories:', bookCategories);
  console.log('Daily activity:', dailyActivity);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

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
    {
      title: "Returned (This Month)",
      value: bookIssues.filter(issue => {
        if (issue.status !== 'returned' || !issue.return_date) return false;
        const returnDate = new Date(issue.return_date);
        const now = new Date();
        return returnDate.getMonth() === now.getMonth() && returnDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                {stat.title === "Returned (This Month)" && "this month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Book Categories Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Book Categories Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {bookCategories && bookCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {bookCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No book categories available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Activity Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="issued" stroke="#3b82f6" name="Issued" strokeWidth={2} />
                  <Line type="monotone" dataKey="returned" stroke="#10b981" name="Returned" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book Status Distribution */}
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