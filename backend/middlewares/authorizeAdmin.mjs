import createError from "http-errors";

export const authorizeAdmin = () => ({
  before: async (handler) => {
    const user = handler.event.user;

    if (!user) {
      throw createError(401, "Authentication is required");
    }

    if (user.role !== "admin") {
      throw createError(403, "Admin access is required");
    }
  },
});
