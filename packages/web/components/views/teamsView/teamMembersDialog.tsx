'use client'

import { getTeamMembers, addTeamMember } from "@/api/team";
import { searchUsers } from "@/api/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Team } from "@/jotai/types";
import { Loader2, Plus, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface TeamMembersDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    team: Team;
}

export function TeamMembersDialog({
    isOpen,
    onOpenChange,
    team
}: TeamMembersDialogProps) {
    const { toast } = useToast();
    const t = useTranslations("teams");
    const [searchUserTerm, setSearchUserTerm] = useState("");
    const [searchUserResults, setSearchUserResults] = useState<Array<{id: string, name: string, email: string}>>([]);
    const [teamMembers, setTeamMembers] = useState<Array<{id: string, name: string, email: string, role: string}>>([]);
    const [selectedRole, setSelectedRole] = useState("member");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [isSearchingUser, setIsSearchingUser] = useState(false);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);

    const handleSearchUser = async (keyword: string) => {
        setSearchUserTerm(keyword);
        
        if (keyword.trim().length < 2) {
            setSearchUserResults([]);
            return;
        }

        setIsSearchingUser(true);
        try {
            const users = await searchUsers(keyword);
            const filteredUsers = users.filter(user => 
                !teamMembers.some(member => member.id === user.id)
            );
            setSearchUserResults(filteredUsers);
        } catch (error) {
            console.error("search user failed:", error);
            toast({
                title: t("members.errors.searchFailed"),
                variant: "destructive",
            });
        } finally {
            setIsSearchingUser(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedUserId) {
            toast({
                title: t("members.errors.selectUser"),
                variant: "destructive",
            });
            return;
        }

        setIsAddingMember(true);
        try {
            await addTeamMember(team.id, {
                userId: selectedUserId,
                role: selectedRole
            });
            
            await loadTeamMembers();
            
            setSelectedUserId("");
            setSearchUserTerm("");
            setSearchUserResults([]);
            
            toast({
                title: t("members.success.memberAdded"),
                variant: "default",
            });
        } catch (error) {
            console.error("loading team member error:", error);
            toast({
                title: t("members.errors.addFailed"),
                variant: "destructive",
            });
        } finally {
            setIsAddingMember(false);
        }
    };

    // 加载团队成员
    const loadTeamMembers = async () => {
        setIsLoadingMembers(true);
        try {
            const members = await getTeamMembers(team.id);
            setTeamMembers(members);
        } catch (error) {
            console.error("loading team member error:", error);
            toast({
                title: t("members.errors.loadFailed"),
                variant: "destructive",
            });
        } finally {
            setIsLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadTeamMembers();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        <span className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-primary" />
                            {t("members.title", { teamName: team.name })}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        {t("members.description")}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="bg-muted/40 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-3">{t("members.addNew")}</h3>
                        <div className="flex gap-2 mb-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t("members.searchPlaceholder")}
                                    className="pl-8"
                                    value={searchUserTerm}
                                    onChange={(e) => handleSearchUser(e.target.value)}
                                />
                                {isSearchingUser && (
                                    <div className="absolute right-2.5 top-2.5">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder={t("members.selectRole")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">{t("members.roles.admin")}</SelectItem>
                                    <SelectItem value="member">{t("members.roles.member")}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button 
                                size="sm" 
                                disabled={!selectedUserId || isAddingMember} 
                                onClick={handleAddMember}
                            >
                                {isAddingMember ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4 mr-2" />
                                )}
                                {t("members.addButton")}
                            </Button>
                        </div>
                        
                        {searchUserResults.length > 0 && (
                            <ScrollArea className="h-32 rounded-md border">
                                <div className="p-2 space-y-1">
                                    {searchUserResults.map(user => (
                                        <div 
                                            key={user.id}
                                            onClick={() => setSelectedUserId(user.id)}
                                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                                                selectedUserId === user.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                            }`}
                                        >
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                            {selectedUserId === user.id && (
                                                <Badge variant="outline" className="ml-2">{t("members.selected")}</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                        
                        {searchUserTerm.length > 0 && searchUserResults.length === 0 && !isSearchingUser && (
                            <div className="text-sm text-muted-foreground py-2">{t("members.noUsersFound")}</div>
                        )}
                    </div>
                    
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">{t("members.membersList", { count: teamMembers.length })}</h3>
                        </div>
                        <Separator />
                        {isLoadingMembers ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <ScrollArea className="h-48">
                                {teamMembers.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        {t("members.noMembers")}
                                    </div>
                                ) : (
                                    <div className="space-y-1 py-2">
                                        {teamMembers.map(member => (
                                            <div 
                                                key={member.id} 
                                                className="p-2 rounded-md hover:bg-muted flex justify-between items-center"
                                            >
                                                <div>
                                                    <div className="font-medium">{member.name}</div>
                                                    <div className="text-sm text-muted-foreground">{member.email}</div>
                                                </div>
                                                <Badge variant={member.role === 'admin' ? "default" : "outline"}>
                                                    {member.role === 'admin' ? t("members.roles.admin") : t("members.roles.member")}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        )}
                    </div>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t("members.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
