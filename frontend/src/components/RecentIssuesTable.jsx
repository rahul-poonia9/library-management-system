import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentIssues = [
  {
    id: 1,
    bookTitle: "Introduction to Algorithms",
    student: "John Doe",
    issueDate: "2025-05-14",
    dueDate: "2025-06-04",
  },
  {
    id: 2,
    bookTitle: "The Catcher in the Rye",
    student: "Jane Smith",
    issueDate: "2025-05-13",
    dueDate: "2025-06-03",
  },
  {
    id: 3,
    bookTitle: "To Kill Unchingbird",
    student: "Alice Johnson",
    issueDate: "2025-05-12",
    dueDate: "2025-06-02",
  },
  {
    id: 4,
    bookTitle: "The Great Gatsby",
    student: "Bob Brown",
    issueDate: "2025-05-11",
    dueDate: "2025-06-01",
  },
];

export function RecentIssuesTable() {
  const handleReturn = (id, bookTitle) => {
    console.log(`Returning book: ${bookTitle} (ID: ${id})`);
    // Here you would typically handle the return logic
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Recent Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-600 font-medium">Book Title</TableHead>
              <TableHead className="text-gray-600 font-medium">Student</TableHead>
              <TableHead className="text-gray-600 font-medium">Issue Date</TableHead>
              <TableHead className="text-gray-600 font-medium">Due Date</TableHead>
              <TableHead className="text-gray-600 font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentIssues.map((issue) => (
              <TableRow key={issue.id} className="border-b border-gray-100">
                <TableCell className="font-medium text-gray-900">
                  {issue.bookTitle}
                </TableCell>
                <TableCell className="text-gray-700">{issue.student}</TableCell>
                <TableCell className="text-gray-700">{issue.issueDate}</TableCell>
                <TableCell className="text-gray-700">{issue.dueDate}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handleReturn(issue.id, issue.bookTitle)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Return
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 