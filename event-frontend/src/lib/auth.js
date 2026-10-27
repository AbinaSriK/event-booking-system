export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function getRole() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decodedPayload.role;
  } catch (error) {
    return null;
  }
}

export function isAdmin() {
  return getRole() === "ADMIN";
}

export function isLoggedIn() {
  return !!getToken();
}


