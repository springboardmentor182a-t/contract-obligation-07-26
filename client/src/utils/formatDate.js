export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
  if (!dateString) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const daysRemaining = (dateString) => {
  if (!dateString) return 0;

  const today = new Date();
  const targetDate = new Date(dateString);

  // Ignore time portion
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diff = targetDate - today;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
