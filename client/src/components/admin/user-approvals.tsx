import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX, Users, Clock, Mail, Calendar, BookOpen, Award, Shield } from "lucide-react";

export default function UserApprovals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery({
    queryKey: ["/api/mongo/admin/pending-approvals"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/mongo/courses"],
  });

  const handleApproveUser = async (userId: any, selectedCourses: any[] = []) => {
    try {
      const response = await fetch(`/api/mongo/admin/users/${userId}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          isApproved: true,
          enrolledCourses: selectedCourses
        })
      });

      if (response.ok) {
        toast({
          title: "User Approved",
          description: "User has been approved and enrolled in selected courses.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/mongo/admin/pending-approvals"] });
        queryClient.invalidateQueries({ queryKey: ["/api/mongo/admin/users"] });
      } else {
        throw new Error('Failed to approve user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectUser = async (userId: any) => {
    try {
      const response = await fetch(`/api/mongo/admin/users/${userId}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          isApproved: false
        })
      });

      if (response.ok) {
        toast({
          title: "User Rejected",
          description: "User request has been rejected.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/mongo/admin/pending-approvals"] });
      } else {
        throw new Error('Failed to reject user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (approvalsLoading) {
    return (
      <div className="rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-gradient-to-r from-emerald-500/10 to-green-500/10">
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-500 to-green-600">
                <Clock className="w-8 h-8 text-white animate-spin" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  Loading Approval Requests
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                  Fetching pending student registrations...
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-gradient-to-r from-emerald-500/10 to-green-500/10">
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-500 to-green-600">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    User Approval Center
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 font-medium text-lg mt-1">
                    Review and approve student registration requests with course enrollment
                  </CardDescription>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                      {(pendingApprovals as any[])?.length || 0} Pending Requests
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        {!pendingApprovals || (pendingApprovals as any[])?.length === 0 ? (
          <div className="rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-gradient-to-r from-emerald-50/50 via-teal-50/50 to-cyan-50/50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20">
            {/* Top Border Accent */}
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            
            <div className="text-center py-20 px-8">
              {/* Enhanced Empty State Icon */}
              <div className="relative mx-auto mb-8">
                <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 flex items-center justify-center shadow-2xl">
                  <Users className="h-16 w-16 text-emerald-500" />
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full animate-pulse" />
                <div className="absolute top-1/2 -left-4 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-ping" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                All Clear! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto mb-8">
                All registration requests have been processed. New requests will appear here for your review.
              </p>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Approval</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Approve users instantly</p>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Course Enrollment</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Assign courses during approval</p>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Smart Management</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Efficient user management</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(pendingApprovals as any[])?.map((user: any, index: number) => (
              <ApprovalRequestCard 
                key={user._id} 
                user={user} 
                courses={(courses as any[]) || []}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ApprovalRequestCard({ user, courses, onApprove, onReject, index }: { 
  user: any; 
  courses: any[]; 
  onApprove: any; 
  onReject: any; 
  index: number;
}) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [showCourseSelection, setShowCourseSelection] = useState(false);

  const handleCourseChange = (courseId: string, checked: any) => {
    if (checked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    await onApprove(user._id, selectedCourses);
    setIsApproving(false);
    setShowCourseSelection(false);
  };

  const waitDays = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
      {/* Header with gradient background */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-t-xl"></div>
      
      {/* User Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-lg flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
              {user.firstName} {user.lastName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 relative">
          <Dialog open={showCourseSelection} onOpenChange={setShowCourseSelection}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-emerald-50 dark:hover:bg-emerald-900" 
                title="Approve User"
              >
                <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
            </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                    <Award className="h-6 w-6 text-emerald-600" />
                    <span>Approve User & Enroll in Courses</span>
                  </DialogTitle>
                  <DialogDescription className="text-lg">
                    Select courses to enroll <span className="font-semibold text-emerald-600">{user.firstName} {user.lastName}</span> in upon approval
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>Available Courses:</span>
                    </Label>
                    <div className="mt-4 space-y-3 max-h-80 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      {courses.map((course: any) => (
                        <div key={course._id} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Checkbox
                            id={`course-${course._id}`}
                            checked={selectedCourses.includes(course._id)}
                            onCheckedChange={(checked) => handleCourseChange(course._id, checked)}
                            className="h-5 w-5"
                          />
                          <Label htmlFor={`course-${course._id}`} className="flex-1 font-medium cursor-pointer">
                            {course.title}
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button 
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold"
                      size="lg"
                    >
                      {isApproving ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Approve & Enroll in {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowCourseSelection(false)}
                      size="lg"
                      className="px-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900" 
            title="Reject User"
            onClick={() => onReject(user._id)}
          >
            <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Username</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">@{user.username}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Registered</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Wait Time</span>
          <Badge variant="outline" className="text-xs">
            {waitDays} day{waitDays !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Pending Review
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {courses.length} courses available
          </span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}