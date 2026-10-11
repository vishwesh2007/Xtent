import { useEffect, useState } from "react";
import { MoreHorizontal, UserRound, UserX } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import EmptyState from "@/components/common/EmptyState";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/members");

      setMembers(response.data.members || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      setProcessingId(id);

      const response = await api.patch(`/members/${id}`, {
        role,
      });

      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member._id === id ? response.data.membership : member,
        ),
      );

      toast.success("Member role updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update member role",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const removeMember = async (id) => {
    try {
      setProcessingId(id);

      await api.delete(`/members/${id}`);

      setMembers((currentMembers) =>
        currentMembers.filter((member) => member._id !== id),
      );

      toast.success("Member removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    } finally {
      setProcessingId(null);
    }
  };

  const roleClass = {
    admin: "border-purple-200 bg-purple-50 text-purple-700",
    manager: "border-blue-200 bg-blue-50 text-blue-700",
    employee: "border-slate-200 bg-slate-50 text-slate-600",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <Card>
          <CardContent className="space-y-3 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Members
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage members and their workspace roles.
        </p>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No members found"
          description="There are no active members in this workspace."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Workspace Members
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {members.length}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Member</th>

                    <th className="pb-3 font-medium">Role</th>

                    <th className="pb-3 font-medium">Status</th>

                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => {
                    const user = member.user;
                    const isProcessing = processingId === member._id;

                    const initials = user?.name
                      ? user.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "U";

                    return (
                      <tr key={member._id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {user?.name || "Unknown User"}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {user?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className={
                              roleClass[member.role] ||
                              "border-slate-200 bg-slate-50 text-slate-600"
                            }
                          >
                            {member.role?.charAt(0).toUpperCase() +
                              member.role?.slice(1)}
                          </Badge>
                        </td>

                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700"
                          >
                            Active
                          </Badge>
                        </td>

                        <td className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isProcessing}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                disabled={
                                  isProcessing || member.role === "admin"
                                }
                                onClick={() =>
                                  updateRole(member._id, "manager")
                                }
                              >
                                Make Manager
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                disabled={
                                  isProcessing || member.role === "admin"
                                }
                                onClick={() =>
                                  updateRole(member._id, "employee")
                                }
                              >
                                Make Employee
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                disabled={
                                  isProcessing || member.role === "admin"
                                }
                                onClick={() => removeMember(member._id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Members;
