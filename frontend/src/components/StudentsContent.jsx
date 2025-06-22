import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search, Trash2, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentDialog } from "./students/StudentDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useStudents, useDeleteStudent, useCreateStudent, useUpdateStudent } from "../hooks/useStudents";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const DEPARTMENTS = [
  "CSE",
  "ECE",
  "ME",
  "CE",
  "CHE",
  "Other",
];

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 rounded-md bg-red-50 border border-red-200">
      <h3 className="text-lg font-semibold text-red-800">Something went wrong:</h3>
      <p className="text-red-600">{error.message}</p>
      <Button onClick={resetErrorBoundary} className="mt-4" variant="outline">Try again</Button>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
);

export function StudentsContent() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState();
  const [loading, setLoading] = useState(false);

  const { students = [], isLoading } = useStudents();
  const { mutate: deleteStudent } = useDeleteStudent();
  const { mutate: createStudent } = useCreateStudent();
  const { mutate: updateStudent } = useUpdateStudent();

  // Filter students based on search criteria
  const filteredStudents = students.filter((student) => {
    const matchesName = !filters.name || student.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesRoll = !filters.roll_number || student.roll_number.toLowerCase().includes(filters.roll_number.toLowerCase());
    const matchesDepartment = !filters.department || student.department === filters.department;
    const matchesSemester = !filters.semester || student.semester === filters.semester;
    return matchesName && matchesRoll && matchesDepartment && matchesSemester;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSaveStudent = async (studentData) => {
    try {
      setLoading(true);
      if (selectedStudent) {
        // Update existing student
        await updateStudent({ id: selectedStudent.id, student: studentData });
        toast({
          title: "Success",
          description: "Student updated successfully.",
        });
      } else {
        // Add new student
        await createStudent(studentData);
        toast({
          title: "Success",
          description: "Student added successfully.",
        });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSelectedStudent(undefined);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteStudent(studentId);
      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setSelectedStudent(undefined);
              setDialogOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </header>

        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name..."
                className="pl-10"
                value={filters.name || ""}
                onChange={(e) => setFilters({ ...filters, name: e.target.value, page: 1 })}
              />
            </div>
            <Input
              placeholder="Search by roll number..."
              value={filters.roll_number || ""}
              onChange={(e) => setFilters({ ...filters, roll_number: e.target.value, page: 1 })}
            />
            <Select
              value={filters.department}
              onValueChange={(value) => setFilters({ ...filters, department: value === "_all" ? undefined : value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Departments</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.semester?.toString() || "_all"}
              onValueChange={(value) =>
                setFilters({ ...filters, semester: value === "_all" ? undefined : parseInt(value), page: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Semesters</SelectItem>
                {SEMESTERS.map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Students List ({filteredStudents.length} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.semester}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedStudent(student);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                          disabled={filters.page === 1}
                        >
                          <PaginationPrevious />
                        </Button>
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setFilters({ ...filters, page })}
                            isActive={page === filters.page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setFilters({ ...filters, page: Math.min(totalPages, filters.page + 1) })}
                          disabled={filters.page === totalPages}
                        >
                          <PaginationNext />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <StudentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          student={selectedStudent}
          onSave={handleSaveStudent}
          loading={loading}
        />
      </main>
    </ErrorBoundary>
  );
} 