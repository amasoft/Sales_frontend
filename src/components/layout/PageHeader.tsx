import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { pageTitleSet } from "@/features/ui/uiSlice";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(pageTitleSet(title));
  }, [dispatch, title]);

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
