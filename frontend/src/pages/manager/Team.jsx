import { useEffect, useMemo, useState } from "react";
import { Mail, Search, Users } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import EmptyState from "@/components/common/EmptyState";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      setLoading(true);

      const response = await api.get("/members");

      const activeMembers = (response.data.members || []).filter(
        (member) => member.status === "active",
      );

      setMembers(activeMembers);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const name = member.user?.name || member.name || "";

      const email = member.user?.email || member.email || "";

      const role = member.role || "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        role.toLowerCase().includes(query)
      );
    });
  }, [members, search]);

  const getMemberName = (member) =>
    member.user?.name || member.name || "Unknown User";

  const getMemberEmail = (member) =>
    member.user?.email || member.email || "No email";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Team
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View the active members in your workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {members.length} active member
                {members.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search team..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <EmptyState
              icon={Users}
              title={
                members.length === 0 ? "No team members" : "No members found"
              }
              description={
                members.length === 0
                  ? "Active workspace members will appear here."
                  : "Try a different search term."
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMembers.map((member) => {
                const name = getMemberName(member);
                const email = getMemberEmail(member);

                return (
                  <div
                    key={member._id}
                    className="rounded-xl border p-4 transition hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">
                              {name}
                            </h3>

                            <div className="mt-1 flex min-w-0 items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                              <p className="truncate text-xs text-muted-foreground">
                                {email}
                              </p>
                            </div>
                          </div>

                          <Badge variant="secondary" className="capitalize">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
