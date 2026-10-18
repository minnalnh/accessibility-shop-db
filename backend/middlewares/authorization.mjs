import createError from "http-errors";

export const authorize = (role) => ({
  before: (handler) => {
    const user = handler.event.user;

    if (!user) {
      throw createError(401, "Användaren är inte autentiserad");
    }

    if (user.role !== role) {
      throw createError(403, "Användaren är inte behörig");
    }
  },
});
