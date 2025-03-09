import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";

interface TeamHeaderProps {
    name: string;
    url?: string;
}

export function TeamHeader({ name, url }: TeamHeaderProps) {
    return (
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                <CardTitle>{name}</CardTitle>
            </div>
            <CardDescription className="flex items-center">
                <Link className="h-3 w-3 mr-1" />
                https://bondma.com/team/{url}
            </CardDescription>
        </CardHeader>
    );
}
