import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Award, Users, BookOpen, RefreshCw, Activity, ChevronDown, ChevronRight, GraduationCap } from "lucide-react";

interface GradeFormProps {
  student: any;
  test: any;
  existingResult?: any;
  onSuccess: () => void;
}

interface TestGradingCardProps {
  test: any;
  onGradeDialog: (student: any, test: any, existingResult?: any) => void;
  getGradeColor: (grade: string) => string;
}

function GradeForm({ student, test, existingResult, onSuccess }: GradeFormProps) {
  const [score, setScore] = useState(existingResult?.score || "");
  const [grade, setGrade] = useState(existingResult?.grade || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = `/api/mongo/tests/${test._id}/results`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: student._id,
          score: parseInt(score),
          grade: grade,
          maxScore: test.maxScore || 100
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save grade');
      }

      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: ["/api/mongo/tests"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/mongo/admin/student-results"] });
      
      toast({
        title: existingResult ? "Grade Updated" : "Grade Added",
        description: `${grade} grade saved for ${student.firstName} ${student.lastName}`,
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save grade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            type="number"
            placeholder="Enter score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            min="0"
            max={test.maxScore || 100}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Out of {test.maxScore || 100} points
          </p>
        </div>
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Select value={grade} onValueChange={setGrade} required>
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C+">C+</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="F">F</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          existingResult ? "Update Grade" : "Add Grade"
        )}
      </Button>
    </form>
  );
}

function TestGradingCard({ test, onGradeDialog, getGradeColor }: TestGradingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: students, isLoading: studentsLoading } = useQuery<any[]>({
    queryKey: ["/api/mongo/admin/course", test.course?._id, "students"],
    queryFn: async () => {
      if (!test.course?._id) return [];
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/mongo/admin/course/${test.course._id}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
    enabled: !!test.course?._id,
  });

  if (studentsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
          
          <div className="flex justify-between items-start pt-2">
            <div className="flex-1 space-y-2">
              {/* Enhanced Title Section */}
              <div className="relative">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{test.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-1 h-6 w-6 hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
                      data-testid={`toggle-test-${test._id}`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 text-indigo-600" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-indigo-600" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Course: {test.course?.title} • Max Score: {test.maxScore || 100} points
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {test.results?.length || 0}/{students?.length || 0}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </CardHeader>
      {isExpanded && (
        <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Student</th>
                <th className="text-left py-2">Email</th>
                <th className="text-center py-2">Score</th>
                <th className="text-center py-2">Grade</th>
                <th className="text-center py-2">Date Completed</th>
                <th className="text-center py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student: any) => {
                const result = test.results?.find((r: any) => 
                  r.student.toString() === student._id.toString()
                );
                
                return (
                  <tr key={student._id} className="border-b">
                    <td className="py-2 font-medium">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-2 text-gray-600">{student.email}</td>
                    <td className="py-2 text-center">
                      {result ? (
                        <span className="font-semibold">
                          {result.score}/{result.maxScore || test.maxScore || 100}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not graded</span>
                      )}
                    </td>
                    <td className="py-2 text-center">
                      {result ? (
                        <Badge className={getGradeColor(result.grade)}>
                          {result.grade}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-2 text-center text-gray-600">
                      {result ? (
                        new Date(result.completedAt).toLocaleDateString()
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-2 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGradeDialog(student, test, result)}
                      >
                        {result ? (
                          <>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Add Grade
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {(!students || students.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No students enrolled in this course</p>
            </div>
          )}
        </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function StudentGrades() {
  const [selectedTest, setSelectedTest] = useState<string>("all");
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTestData, setSelectedTestData] = useState<any>(null);
  const [existingResult, setExistingResult] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: tests, isLoading: testsLoading } = useQuery<any[]>({
    queryKey: ["/api/mongo/tests"],
  });

  const { data: studentResults, isLoading: resultsLoading } = useQuery<any[]>({
    queryKey: ["/api/mongo/admin/student-results"],
  });


  const openGradeDialog = (student: any, test: any, existingResult?: any) => {
    setSelectedStudent(student);
    setSelectedTestData(test);
    setExistingResult(existingResult || null);
    setGradeDialogOpen(true);
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800',
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  if (testsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const filteredTests = selectedTest && selectedTest !== "all"
    ? tests?.filter(test => test._id === selectedTest)
    : tests;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative group">
        <div className="relative rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-gradient-to-br from-white/90 via-blue-50/80 to-purple-50/60 dark:from-gray-900/90 dark:via-blue-900/30 dark:to-purple-900/20 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-pink-500 relative"></div>
          <div className="relative bg-gradient-to-r from-white/20 via-white/10 to-white/5 backdrop-blur-sm">
            <div className="p-10">
              <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
                <div className="flex items-center space-x-8">
                  <div className="relative group/icon">
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                      <GraduationCap className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                      Student Grading
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-xl font-medium max-w-md">
                      Manage and track student performance across all courses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Filter by Test:</label>
            <Select value={selectedTest} onValueChange={setSelectedTest}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Tests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                {tests?.map((test) => (
                  <SelectItem key={test._id} value={test._id}>
                    {test.title} ({test.course?.title})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests with Students */}
      <div className="space-y-4">
        {filteredTests?.map((test) => (
          <TestGradingCard
            key={test._id}
            test={test}
            onGradeDialog={openGradeDialog}
            getGradeColor={getGradeColor}
          />
        ))}
      </div>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {existingResult ? "Edit Grade" : "Add Grade"}
            </DialogTitle>
            <DialogDescription>
              {existingResult ? "Update" : "Add"} grade for {selectedStudent?.firstName} {selectedStudent?.lastName} 
              on {selectedTestData?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && selectedTestData && (
            <GradeForm
              student={selectedStudent}
              test={selectedTestData}
              existingResult={existingResult}
              onSuccess={() => setGradeDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredTests?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Found</h3>
            <p className="text-gray-500">
              {selectedTest !== "all" ? "No test found for the selected filter" : "No tests available"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}