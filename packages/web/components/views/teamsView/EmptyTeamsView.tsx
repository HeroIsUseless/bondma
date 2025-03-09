import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface EmptyTeamsViewProps {
  onCreateTeamClick: () => void;
}

export function EmptyTeamsView({ onCreateTeamClick }: EmptyTeamsViewProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-10 text-center bg-muted/30">
      <h3 className="text-xl font-semibold mb-2">{t("teams.empty.title")}</h3>
      <p className="text-muted-foreground mb-6">{t("teams.empty.description")}</p>
      <Button onClick={onCreateTeamClick}>
        <Plus className="h-4 w-4 mr-2" />
        {t("teams.empty.createButton")}
      </Button>
    </div>
  );
}