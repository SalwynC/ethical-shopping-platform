import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}

