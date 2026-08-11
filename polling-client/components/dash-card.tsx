"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Poll } from "@/types";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CalendarClock,
  CalendarPlus,
  Trash2,
  Link2,
  BarChart2,
  Globe,
} from "lucide-react";
import { fetchWithRefresh } from "@/lib/api";

interface DashcardProps extends Poll {
  onDelete: () => void;
}

const Dashcard = ({ onDelete, ...Poll }: DashcardProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(false);

  const isExpired = new Date(Poll.expiresAt) < new Date();

  const handlePublish = async () => {
    try{
      const res = await fetchWithRefresh(
        `/api/polling/publishpoll/${Poll.id}`,
        {
          method: "PATCH",
        },
      );
      const data = await res.json();
      if (data.result.message) {
        toast.success("Poll published!");
        onDelete();
      }
    }catch(e){
      toast.error("failed to publish!")
    }finally{
    }
  };

  const handleCopy = async () => {
    const link = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/poll/${Poll.id}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    try{
      setLoading(true);
      const res = await fetchWithRefresh(
        `/api/polling/deletepoll/${Poll.id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.result === "Pool deleted successfully.") {
        toast.success("Poll deleted.");
        onDelete();
      }
    }catch(e){
      toast.error("Failed to delete poll.")
    }finally{
      setLoading(false);
    }
  };

  return (
    <Card className="w-[600px] hover:shadow-md transition-shadow duration-200 mt-4">
      {/* Header — question + status */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base font-semibold leading-snug capitalize flex-1">
            {Poll.question}
          </h2>
          <Badge
            variant={
              isExpired
                ? "destructive"
                : Poll.isActive
                  ? "default"
                  : "secondary"
            }
            className="shrink-0 mt-0.5"
          >
            {isExpired ? "Expired" : Poll.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      {/* Content — dates + meta badges */}
      <CardContent className="py-4 space-y-4">
        {/* Dates */}
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
            Created:&nbsp;
            <span className="text-foreground font-medium">
              {Poll.createdAt &&
                format(new Date(Poll.createdAt), "MMM d, yyyy · hh:mm a")}
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarClock className="w-3.5 h-3.5 shrink-0" />
            Expires:&nbsp;
            <span
              className={`font-medium ${isExpired ? "text-destructive" : "text-foreground"}`}
            >
              {Poll.expiresAt &&
                format(new Date(Poll.expiresAt), "MMM d, yyyy · hh:mm a")}
            </span>
          </p>
        </div>

        {/* Meta badges */}
        <div className="flex items-center gap-2">
          <Badge variant={Poll.isPublished ? "default" : "secondary"}>
            {Poll.isPublished ? "Published" : "Draft"}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Globe className="w-3 h-3" />
            {Poll.anonymousVoting ? "Anonymous" : "Non-anonymous"}
          </Badge>
        </div>
      </CardContent>

      <Separator />

      {/* Footer — actions */}
      <CardFooter className="pt-4 flex items-center justify-between">
        {/* Primary actions */}
        <div className="flex items-center gap-2 ">
          <Button size="sm" onClick={handlePublish} disabled={Poll.isPublished}>
            Publish
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Link2 className="w-3.5 h-3.5 mr-1.5" />
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <Link href={`/analytic/${Poll.id}`}>
            <Button size="sm" variant="outline">
              <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
              Analytics
            </Button>
          </Link>
        </div>

        {/* Destructive action — separated */}
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          {loading?"Deleting":"Delete"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Dashcard;
