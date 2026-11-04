
import { getCurrentUser } from "./auth";

const STORAGE_KEY = "subscription-manager-data";

// Get a separate storage key for each user
function getUserStorageKey() {
  const user = getCurrentUser();

  if (!user?.id) {
    return null;
  }

  return `${STORAGE_KEY}-${user.id}`;
}

// Get subscriptions for the logged-in user
export function getSubscriptions() {
  const key = getUserStorageKey();

  if (!key) {
    return [];
  }

  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const subscriptions = JSON.parse(data);

    return Array.isArray(subscriptions) ? subscriptions : [];
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    return [];
  }
}

// Save subscriptions for the logged-in user
export function saveSubscriptions(subscriptions) {
  const key = getUserStorageKey();

  if (!key) {
    return;
  }

  if (!Array.isArray(subscriptions)) {
    console.error("Subscriptions must be an array.");
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(subscriptions));
  } catch (error) {
    console.error("Error saving subscriptions:", error);
  }
}
