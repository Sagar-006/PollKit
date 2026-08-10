"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fetchWithRefresh } from "@/lib/api";

export function CreatePollForm() {
 const router = useRouter(); 
  const [loading,setLoading] = useState<boolean>(false); 
  const [options, setOptions] = useState(["", ""]);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [question,setQuestion] = useState<string>("");

  async function createPoll (e:any){
    e.preventDefault();

    try{
      setLoading(true);
      const createPoll = await fetchWithRefresh("/api/polling/createpoll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          pollOptions: options,
          anonymousVoting: anonymous,
          expiresAt: expiryDate,
        }),
      });

    const data = await createPoll.json();
    setLoading(false);
    // console.log("data on frontend",data);
    if(data.success === false){
      toast.error(data.message)
    }
    if(data.data === "poll created successfully!"){
      toast.success("Poll created successfully!")
      router.push("/dashboard");
    }
    }catch(e:any){
      toast.error(e.message);
    }finally{
      setLoading(false)
    }

  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted/30 py-12 px-4">
      <div className="w-full max-w-lg bg-background border rounded-2xl shadow-sm p-8 space-y-7">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create a Poll
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to set up your poll.
          </p>
        </div>
        <form onSubmit={createPoll}>
          <div className="space-y-5">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Input
                id="question"
                placeholder="e.g. Who is your favourite actor?"
                className="h-11"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      className="h-10"
                      value={option}
                      onChange={(e) => {
                        const updated = [...options];
                        updated[index] = e.target.value;
                        setOptions(updated);
                      }}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() =>
                          setOptions(options.filter((_, i) => i !== index))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 w-full border-dashed text-muted-foreground hover:text-foreground"
                onClick={() => setOptions([...options, ""])}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>

            {/* Expiry Date */}
            {/* Expiry Date + Time */}
            <div className="space-y-2">
              <Label>Expiry Date & Time</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate
                      ? format(expiryDate, "PPP, hh:mm a")
                      : "Pick an expiry date & time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {/* Calendar */}
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => {
                      if (date) {
                        const updated = new Date(date);
                        updated.setHours(expiryDate?.getHours() ?? 0);
                        updated.setMinutes(expiryDate?.getMinutes() ?? 0);
                        setExpiryDate(updated);
                      }
                    }}
                    disabled={(date) => date < new Date()}
                  />

                  {/* Time Picker */}
                  <div className="border-t p-3 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      Select Time
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Hours */}
                      <div className="flex flex-col items-center gap-1">
                        <Label className="text-xs text-muted-foreground">
                          Hour
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          placeholder="12"
                          className="w-16 h-9 text-center"
                          value={expiryDate ? format(expiryDate, "hh") : ""}
                          onChange={(e) => {
                            const updated = new Date(expiryDate ?? new Date());
                            const isPM = expiryDate
                              ? expiryDate.getHours() >= 12
                              : false;
                            updated.setHours(
                              (Number(e.target.value) % 12) + (isPM ? 12 : 0),
                            );
                            setExpiryDate(updated);
                          }}
                        />
                      </div>

                      <span className="mt-5 text-muted-foreground font-medium">
                        :
                      </span>

                      {/* Minutes */}
                      <div className="flex flex-col items-center gap-1">
                        <Label className="text-xs text-muted-foreground">
                          Min
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={59}
                          placeholder="00"
                          className="w-16 h-9 text-center"
                          value={expiryDate ? format(expiryDate, "mm") : ""}
                          onChange={(e) => {
                            const updated = new Date(expiryDate ?? new Date());
                            updated.setMinutes(Number(e.target.value));
                            setExpiryDate(updated);
                          }}
                        />
                      </div>

                      {/* AM/PM */}
                      <div className="flex flex-col items-center gap-1">
                        <Label className="text-xs text-muted-foreground">
                          AM/PM
                        </Label>
                        <div className="flex rounded-md border overflow-hidden h-9">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = new Date(
                                expiryDate ?? new Date(),
                              );
                              if (updated.getHours() >= 12) {
                                updated.setHours(updated.getHours() - 12);
                              }
                              setExpiryDate(updated);
                            }}
                            className={cn(
                              "px-3 text-sm transition-colors",
                              expiryDate && expiryDate.getHours() < 12
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted",
                            )}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = new Date(
                                expiryDate ?? new Date(),
                              );
                              if (updated.getHours() < 12) {
                                updated.setHours(updated.getHours() + 12);
                              }
                              setExpiryDate(updated);
                            }}
                            className={cn(
                              "px-3 text-sm transition-colors",
                              expiryDate && expiryDate.getHours() >= 12
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted",
                            )}
                          >
                            PM
                          </button>
                        </div>
                      </div>

                      {/* Done Button */}
                      <Button
                        type="button"
                        size="sm"
                        className="mt-5"
                        onClick={() => setCalendarOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Poll will stop accepting votes after this date & time.
              </p>
            </div>

            {/* Anonymous Voting */}
            <div className="flex items-center justify-between rounded-xl border px-4 py-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Anonymous Voting</p>
                <p className="text-xs text-muted-foreground">
                  Voter identities will be hidden
                </p>
              </div>
              <Switch
                checked={anonymous}
                onClick={() => setAnonymous(!anonymous)}
              />
            </div>

            {/* Submit */}
            <Button disabled={loading} type="submit" className="w-full h-11 text-sm font-medium">
              {loading ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
