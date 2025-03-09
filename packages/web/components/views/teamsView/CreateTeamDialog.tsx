import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newTeamName: string;
  newTeamUrl: string;
  onNewTeamNameChange: (name: string) => void;
  onNewTeamUrlChange: (url: string) => void;
  onCreateTeam: () => void;
  isLoading: boolean;
}

export function CreateTeamDialog({
  isOpen,
  onOpenChange,
  newTeamName,
  newTeamUrl,
  onNewTeamNameChange,
  onNewTeamUrlChange,
  onCreateTeam,
  isLoading,
}: CreateTeamDialogProps) {
  const t = useTranslations();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("teams.create.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">{t("teams.create.name")}</Label>
            <Input
              id="team-name"
              value={newTeamName}
              onChange={(e) => onNewTeamNameChange(e.target.value)}
              placeholder={t("teams.create.namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-url">{t("teams.create.url")}</Label>
            <div className="flex">
              <div className="bg-muted py-2 px-3 rounded-l-md border border-r-0 text-sm text-muted-foreground">
                {t("teams.create.urlPrefix")}
              </div>
              <Input
                id="team-url"
                value={newTeamUrl}
                onChange={(e) => onNewTeamUrlChange(e.target.value)}
                className="rounded-l-none"
                placeholder={t("teams.create.urlPlaceholder")}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("teams.create.cancel")}
          </Button>
          <Button onClick={onCreateTeam} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("teams.create.create")}
              </>
            ) : (
              t("teams.create.create")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
