import { useEffect, useState } from "react";
import { Check, Clock, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";

const JoinRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/members/requests");

      setRequests(response.data.requests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load join requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequest = async (id, status) => {
    try {
      setProcessingId(id);

      await api.patch(`/members/${id}`, {
        status,
      });

      setRequests((currentRequests) =>
        currentRequests.filter((request) => request._id !== id),
      );

      toast.success(
        status === "active" ? "Join request approved" : "Join request rejected",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update join request",
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <Card>
          <CardContent className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-lg bg-muted"
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
          Join Requests
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage requests to join your workspace.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No pending requests"
          description="There are currently no membership requests waiting for approval."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Pending Requests
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {requests.length}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {requests.map((request) => {
              const user = request.user;
              const isProcessing = processingId === request._id;

              return (
                <div
                  key={request._id}
                  className="flex flex-col gap-4 rounded-xl border p-4 transition hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user?.name || "Unknown User"}
                      </p>

                      <p className="truncate text-sm text-muted-foreground">
                        {user?.email || "No email"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Requested{" "}
                        {request.requestedAt
                          ? new Date(request.requestedAt).toLocaleDateString()
                          : "recently"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => updateRequest(request._id, "active")}
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isProcessing}
                      onClick={() => updateRequest(request._id, "rejected")}
                    >
                      <X className="mr-1.5 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JoinRequests;
