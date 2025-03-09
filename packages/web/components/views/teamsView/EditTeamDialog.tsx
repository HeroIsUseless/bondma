import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface EditTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamUrl: string;
  onTeamNameChange: (value: string) => void;
  onTeamUrlChange: (value: string) => void;
  onUpdateTeam: () => Promise<void>;
  isLoading: boolean;
}

export function EditTeamDialog({
  isOpen,
  onOpenChange,
  teamName,
  teamUrl,
  onTeamNameChange,
  onTeamUrlChange,
  onUpdateTeam,
  isLoading,
}: EditTeamDialogProps) {
  const t = useTranslations("teams");
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("edit.title")}</DialogTitle>
          <DialogDescription>{t("edit.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-team-name" className="text-right">
              {t("edit.name")}
            </Label>
            <Input
              id="edit-team-name"
              value={teamName}
              onChange={(e) => onTeamNameChange(e.target.value)}
              className="col-span-3"
              placeholder={t("edit.namePlaceholder")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-team-url" className="text-right">
              {t("edit.url")}
            </Label>
            <Input
              id="edit-team-url"
              value={teamUrl}
              onChange={(e) => onTeamUrlChange(e.target.value)}
              className="col-span-3"
              placeholder={t("edit.urlPlaceholder")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("edit.cancel")}
          </Button>
          <Button onClick={onUpdateTeam} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("edit.updateInProgress")}
              </>
            ) : (
              t("edit.update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
