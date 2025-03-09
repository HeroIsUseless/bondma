import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface NoPermissionViewProps {
  teamId: string;
}

// Component to show when user has no permission to access a team
const NoPermissionView = ({ teamId }: NoPermissionViewProps) => {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{t('teamPage.noPermission')}</CardTitle>
          <CardDescription>
            {t('teamPage.noPermissionDescription', { teamId })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>{t('teamPage.possibleReasons')}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t('teamPage.notMember')}</li>
            <li>{t('teamPage.insufficientPermission')}</li>
            <li>{t('teamPage.teamNotExist')}</li>
          </ul>
          <div className="flex justify-between mt-4">
            <Link href="/team">
              <Button variant="outline">{t('teamPage.backToTeams')}</Button>
            </Link>
            <Link href="/">
              <Button>{t('teamPage.backToHome')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoPermissionView;
