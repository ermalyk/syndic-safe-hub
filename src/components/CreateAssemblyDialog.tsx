import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";

interface AgendaItem {
  id: string;
  description: string;
  votingOption: "yes" | "no" | "abstained";
}

interface CreateAssemblyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const BUILDING_LOCATIONS = [
  "ул. Витоша 15, София",
  "бул. Цар Борис III 125, София",
  "ул. Граф Игнатиев 88, Пловдив",
  "бул. Мария Луиза 23, Варна",
  "ул. Христо Ботев 45, Бургас"
];

export const CreateAssemblyDialog = ({ open, onOpenChange, onSuccess }: CreateAssemblyDialogProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [buildingLocation, setBuildingLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentVotingOption, setCurrentVotingOption] = useState<"yes" | "no" | "abstained">("yes");

  const handleAddOrEditAgendaItem = () => {
    if (!currentDescription.trim()) {
      toast({
        title: t("createAssembly.error"),
        description: t("createAssembly.agendaItemDescription") + " is required",
        variant: "destructive",
      });
      return;
    }

    if (editingItemId) {
      setAgendaItems(items =>
        items.map(item =>
          item.id === editingItemId
            ? { ...item, description: currentDescription, votingOption: currentVotingOption }
            : item
        )
      );
      setEditingItemId(null);
    } else {
      const newItem: AgendaItem = {
        id: Date.now().toString(),
        description: currentDescription,
        votingOption: currentVotingOption,
      };
      setAgendaItems([...agendaItems, newItem]);
    }

    setCurrentDescription("");
    setCurrentVotingOption("yes");
    setShowAgendaForm(false);
  };

  const handleEditItem = (item: AgendaItem) => {
    setEditingItemId(item.id);
    setCurrentDescription(item.description);
    setCurrentVotingOption(item.votingOption);
    setShowAgendaForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setAgendaItems(items => items.filter(item => item.id !== itemId));
  };

  const handleCreate = async () => {
    if (!title || !buildingLocation || !date || !time) {
      toast({
        title: t("createAssembly.error"),
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (agendaItems.length === 0) {
      toast({
        title: t("createAssembly.error"),
        description: "Please add at least one agenda item",
        variant: "destructive",
      });
      return;
    }

    try {
      await mockApi.createAssembly({
        title,
        buildingLocation,
        date,
        time,
        agendaItems,
      });

      toast({
        title: t("createAssembly.created"),
      });

      // Reset form
      setTitle("");
      setBuildingLocation("");
      setDate("");
      setTime("");
      setAgendaItems([]);
      setCurrentDescription("");
      setCurrentVotingOption("yes");
      setShowAgendaForm(false);
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: t("createAssembly.error"),
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setTitle("");
    setBuildingLocation("");
    setDate("");
    setTime("");
    setAgendaItems([]);
    setCurrentDescription("");
    setCurrentVotingOption("yes");
    setShowAgendaForm(false);
    setEditingItemId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createAssembly.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t("dashboard.createAssembly")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("createAssembly.title")}
            />
          </div>

          {/* Building Location */}
          <div className="space-y-2">
            <Label>{t("createAssembly.buildingLocation")}</Label>
            <Select value={buildingLocation} onValueChange={setBuildingLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t("createAssembly.selectLocation")} />
              </SelectTrigger>
              <SelectContent>
                {BUILDING_LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t("createAssembly.date")}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">{t("createAssembly.time")}</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Agenda */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t("createAssembly.agenda")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAgendaForm(!showAgendaForm);
                  setEditingItemId(null);
                  setCurrentDescription("");
                  setCurrentVotingOption("yes");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("createAssembly.addAgendaItem")}
              </Button>
            </div>

            {/* Agenda Items List */}
            {agendaItems.length === 0 && !showAgendaForm && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("createAssembly.noAgendaItems")}
              </p>
            )}

            {agendaItems.length > 0 && (
              <div className="space-y-2">
                {agendaItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 bg-muted rounded-lg flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {index + 1}. {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("createAssembly.votingOptions")}: {t(`createAssembly.${item.votingOption}`)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Agenda Item Form */}
            {showAgendaForm && (
              <div className="p-4 border border-border rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("createAssembly.agendaItemDescription")}
                  </Label>
                  <Textarea
                    id="description"
                    value={currentDescription}
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    placeholder={t("createAssembly.agendaItemDescriptionPlaceholder")}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("createAssembly.votingOptions")}</Label>
                  <RadioGroup
                    value={currentVotingOption}
                    onValueChange={(value) => setCurrentVotingOption(value as "yes" | "no" | "abstained")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="font-normal cursor-pointer">
                        {t("createAssembly.yes")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="font-normal cursor-pointer">
                        {t("createAssembly.no")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="abstained" id="abstained" />
                      <Label htmlFor="abstained" className="font-normal cursor-pointer">
                        {t("createAssembly.abstained")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-2">
                  <Button type="button" onClick={handleAddOrEditAgendaItem}>
                    {editingItemId ? t("common.edit") : t("common.save")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAgendaForm(false);
                      setEditingItemId(null);
                      setCurrentDescription("");
                      setCurrentVotingOption("yes");
                    }}
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={handleCancel}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreate}>
              {t("common.create")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
