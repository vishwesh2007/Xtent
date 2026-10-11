import { createContext, useContext, useEffect, useState } from "react";

import api from "@/lib/api";
import { useAuth } from "./AuthContext";

const OrgContext = createContext(null);

export const OrgProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [memberships, setMemberships] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrganizations = async () => {
    try {
      const response = await api.get("/orgs/mine");

      const data = response.data.memberships || [];

      setMemberships(data);

      const activeMemberships = data.filter(
        (membership) =>
          membership.status === "active" && membership.organization,
      );

      if (activeMemberships.length === 0) {
        setActiveOrg(null);
        localStorage.removeItem("activeOrg");
        return;
      }

      const storedOrg = localStorage.getItem("activeOrg");

      if (storedOrg) {
        try {
          const parsedOrg = JSON.parse(storedOrg);

          const matchingMembership = activeMemberships.find(
            (membership) => membership.organization?._id === parsedOrg?._id,
          );

          if (matchingMembership) {
            setActiveOrg(matchingMembership.organization);

            return;
          }

          localStorage.removeItem("activeOrg");
        } catch {
          localStorage.removeItem("activeOrg");
        }
      }

      if (activeMemberships.length === 1) {
        const organization = activeMemberships[0].organization;

        setActiveOrg(organization);

        localStorage.setItem("activeOrg", JSON.stringify(organization));

        return;
      }

      setActiveOrg(null);
    } catch (error) {
      console.error("Failed to load organizations:", error);

      setMemberships([]);
      setActiveOrg(null);
    } finally {
      setLoading(false);
    }
  };

  const switchOrg = (organizationId) => {
    const membership = memberships.find(
      (item) =>
        item.status === "active" && item.organization?._id === organizationId,
    );

    if (!membership) {
      return;
    }

    const organization = membership.organization;

    setActiveOrg(organization);

    localStorage.setItem("activeOrg", JSON.stringify(organization));
  };

  const refreshOrganizations = async () => {
    setLoading(true);

    await loadOrganizations();
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      setMemberships([]);
      setActiveOrg(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    loadOrganizations();
  }, [isAuthenticated, user, authLoading]);

  const activeMemberships = memberships.filter(
    (membership) => membership.status === "active" && membership.organization,
  );

  const pendingMemberships = memberships.filter(
    (membership) => membership.status === "pending",
  );

  const activeMembership = activeMemberships.find(
    (membership) => membership.organization?._id === activeOrg?._id,
  );

  const activeRole = activeMembership?.role || null;

  const value = {
    memberships,
    activeMemberships,
    pendingMemberships,
    activeOrg,
    activeRole,
    loading,
    switchOrg,
    refreshOrganizations,
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrg = () => {
  const context = useContext(OrgContext);

  if (!context) {
    throw new Error("useOrg must be used inside OrgProvider");
  }

  return context;
};

export default OrgContext;
