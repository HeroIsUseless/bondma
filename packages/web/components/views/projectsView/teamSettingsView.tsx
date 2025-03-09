'use client'
import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { nowTeamAtom, teamsAtom } from "@/jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

export function TeamSettingsView() {
  const t = useTranslations("teams.settings");
  const commonT = useTranslations("common");
  
  const [teams, setTeams] = useAtom(teamsAtom);
  const [currentTeam, setCurrentTeam] = useAtom(nowTeamAtom);
  
  const [teamName, setTeamName] = useState(currentTeam?.name || "");
  const [teamUrl, setTeamUrl] = useState(currentTeam?.url || "");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [nameError, setNameError] = useState("");
  const [urlError, setUrlError] = useState("");

  // Example team member data
  const [members, setMembers] = useState([
    { id: 1, name: "John", email: "john@example.com", role: t("members.roles.admin"), avatar: "https://github.com/shadcn.png" },
    { id: 2, name: "Sarah", email: "sarah@example.com", role: t("members.roles.member"), avatar: "https://github.com/shadcn.png" },
    { id: 3, name: "Mike", email: "mike@example.com", role: t("members.roles.member"), avatar: "https://github.com/shadcn.png" },
  ]);

  // Validate team name
  const isNameValid = teamName.length <= 12 && teamName.length > 0;
  // Validate team URL
  const isUrlValid = /^[a-zA-Z0-9_]{1,24}$/.test(teamUrl);
  // Enable save button
  const canSave = isNameValid && isUrlValid;
  // Check if delete confirmation is valid
  const isDeleteConfirmValid = deleteConfirmation === currentTeam?.name;

  const validateName = (name: string) => {
    if (name.length === 0) {
      setNameError(t("general.errors.nameRequired"));
      return false;
    } else if (name.length > 12) {
      setNameError(t("general.errors.nameTooLong"));
      return false;
    }
    setNameError("");
    return true;
  };

  const validateUrl = (url: string) => {
    if (url.length === 0) {
      setUrlError(t("general.errors.urlRequired"));
      return false;
    } else if (url.length > 24) {
      setUrlError(t("general.errors.urlTooLong"));
      return false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(url)) {
      setUrlError(t("danger.urlValidation"));
      return false;
    }
    setUrlError("");
    return true;
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setTeamName(name);
    validateName(name);
  };

  const handleTeamUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setTeamUrl(url);
    validateUrl(url);
  };

  const handleSaveTeamSettings = () => {
    if (!canSave) return;
    
    // Logic to update team information
    if (currentTeam) {
      const updatedTeams = teams.map(team => 
        team.id === currentTeam.id ? { ...team, name: teamName, url: teamUrl } : team
      );
      setTeams(updatedTeams);
      setCurrentTeam({ ...currentTeam, name: teamName, url: teamUrl });
    }
  };

  const handleDeleteTeam = () => {
    if (!isDeleteConfirmValid) return;
    
    // Logic to delete the team
    const updatedTeams = teams.filter(team => team.id !== currentTeam?.id);
    setTeams(updatedTeams);
    setCurrentTeam(updatedTeams[0] || null);
    setShowDeleteDialog(false);
  };

  const handleAddMember = () => {
    if (!newMemberEmail) return;
    
    // Logic to add a team member
    const newMember = {
      id: Date.now(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: newMemberRole === "admin" ? t("members.roles.admin") : t("members.roles.member"),
      avatar: "https://github.com/shadcn.png"
    };
    
    setMembers([...members, newMember]);
    setNewMemberEmail("");
    setNewMemberRole("member");
    setShowAddMemberDialog(false);
  };

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const addTeamMember = () => {
    // In a real scenario, this would send an invite email or add the user to the team
    setNewMemberEmail("");
  };

  const removeMember = (memberId: string) => {
    // Logic to remove a team member
    if (!currentTeam) return;
  };

  const updateMemberRole = (memberId: string, newRole: string) => {
    // Logic to update a team member's role
    if (!currentTeam) return;
  };

  // Mock team member data
  const teamMembers = [
    { id: "1", name: "John Doe", email: "john@example.com", role: t("members.roles.admin"), avatarUrl: "https://github.com/shadcn.png" },
    { id: "2", name: "Sarah Smith", email: "sarah@example.com", role: t("members.roles.editor"), avatarUrl: "" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", role: t("members.roles.readonly"), avatarUrl: "" },
  ];

  if (!currentTeam) {
    return <div className="p-4">{t("members.noTeamSelected")}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 gap-2">
          <TabsTrigger value="general">{t("tabs.general")}</TabsTrigger>
          <TabsTrigger value="billing">{t("tabs.billing")}</TabsTrigger>
          <TabsTrigger value="members">{t("tabs.members")}</TabsTrigger>
        </TabsList>

        {/* 基本设置 */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("general.title")}</CardTitle>
              <CardDescription>{t("general.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">{t("general.name")}</Label>
                <Input 
                  id="teamName" 
                  value={teamName} 
                  onChange={handleTeamNameChange} 
                  placeholder={t("general.namePlaceholder")} 
                  maxLength={12}
                />
                <p className={`text-xs ${teamName.length > 12 ? "text-red-500" : "text-gray-500"}`}>
                  {teamName.length}/12 {t("general.characters")}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamUrl">{t("general.url")}</Label>
                <div className="flex items-center">
                  <span className="mr-1 text-gray-500">{t("general.urlPrefix")}</span>
                  <Input 
                    id="teamUrl" 
                    value={teamUrl} 
                    onChange={handleTeamUrlChange} 
                    placeholder={t("general.urlPlaceholder")} 
                    maxLength={24}
                    className={!isUrlValid && teamUrl ? "border-red-500" : ""}
                  />
                </div>
                {!isUrlValid && teamUrl && (
                  <p className="text-xs text-red-500">{t("danger.urlValidation")}</p>
                )}
                <p className="text-xs text-gray-500">
                  {teamUrl.length}/24 {t("general.characters")}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleSaveTeamSettings} disabled={!canSave}>{t("general.saveSettings")}</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-red-600">{t("danger.title")}</CardTitle>
              <CardDescription>{t("danger.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("danger.warning")}</AlertTitle>
                <AlertDescription>
                  {t("danger.warningMessage")}
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">{t("danger.deleteTeam")}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("danger.confirmDelete")}</DialogTitle>
                    <DialogDescription>
                      {t("danger.confirmDeleteDescription", { teamName: currentTeam.name })}
                    </DialogDescription>
                  </DialogHeader>
                  <Input placeholder={t("danger.confirmDeletePlaceholder", { teamName: currentTeam.name })} className="mt-4" />
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      {t("danger.cancel")}
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteTeam}>
                      {t("danger.confirmButton")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>{t("members.title")}</CardTitle>
              <CardDescription>{t("members.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Input 
                  placeholder={t("members.addPlaceholder")} 
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addTeamMember}>{t("members.add")}</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("members.tableHeaders.member")}</TableHead>
                    <TableHead>{t("members.tableHeaders.email")}</TableHead>
                    <TableHead>{t("members.tableHeaders.role")}</TableHead>
                    <TableHead className="w-[100px]">{t("members.tableHeaders.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === t("members.roles.admin") ? "default" : member.role === t("members.roles.editor") ? "outline" : "secondary"}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("members.dropdown.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, t("members.roles.admin"))}>
                              {t("members.dropdown.setAdmin")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, t("members.roles.editor"))}>
                              {t("members.dropdown.setEditor")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, t("members.roles.readonly"))}>
                              {t("members.dropdown.setReadonly")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => removeMember(member.id)}
                            >
                              {t("members.dropdown.remove")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>{t("billing.title")}</CardTitle>
              <CardDescription>{t("billing.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{t("billing.currentPlan")}</h3>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge>{t("billing.free")}</Badge>
                      <p className="mt-1 text-sm text-gray-600">{t("billing.freePlanDesc")}</p>
                    </div>
                    <Button>{t("billing.upgradePro")}</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">{t("billing.resourceUsage")}</h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t("billing.projects")}</span>
                      <span className="text-sm">3/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t("billing.members")}</span>
                      <span className="text-sm">3/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t("billing.storage")}</span>
                      <span className="text-sm">256MB/1GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">{t("billing.planComparison")}</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">{t("billing.freeTier")}</h4>
                    <p className="text-gray-600 mb-2">{t("billing.perMonth", { price: 0 })}</p>
                    <ul className="text-sm space-y-1">
                      <li>{t("billing.freeTierFeatures.projects")}</li>
                      <li>{t("billing.freeTierFeatures.members")}</li>
                      <li>{t("billing.freeTierFeatures.storage")}</li>
                      <li>{t("billing.freeTierFeatures.support")}</li>
                    </ul>
                    <Button variant="outline" className="mt-4 w-full">{t("billing.currentPlanButton")}</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 border-blue-500">
                    <h4 className="font-medium">{t("billing.proTier")}</h4>
                    <p className="text-gray-600 mb-2">{t("billing.perMonth", { price: 99 })}</p>
                    <ul className="text-sm space-y-1">
                      <li>{t("billing.proTierFeatures.projects")}</li>
                      <li>{t("billing.proTierFeatures.members")}</li>
                      <li>{t("billing.proTierFeatures.storage")}</li>
                      <li>{t("billing.proTierFeatures.advancedFeatures")}</li>
                      <li>{t("billing.proTierFeatures.prioritySupport")}</li>
                    </ul>
                    <Button className="mt-4 w-full">{t("billing.upgradeToProButton")}</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">{t("billing.enterpriseTier")}</h4>
                    <p className="text-gray-600 mb-2">{t("billing.perMonth", { price: 299 })}</p>
                    <ul className="text-sm space-y-1">
                      <li>{t("billing.enterpriseTierFeatures.projects")}</li>
                      <li>{t("billing.enterpriseTierFeatures.members")}</li>
                      <li>{t("billing.enterpriseTierFeatures.storage")}</li>
                      <li>{t("billing.enterpriseTierFeatures.advancedFeatures")}</li>
                      <li>{t("billing.enterpriseTierFeatures.prioritySupport")}</li>
                      <li>{t("billing.enterpriseTierFeatures.customDomain")}</li>
                    </ul>
                    <Button variant="outline" className="mt-4 w-full">{t("billing.upgradeToEnterpriseButton")}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}