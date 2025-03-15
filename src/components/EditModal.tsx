"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataItemRequest, DataItemTable } from "@/types";
import {
  DATES_MAPPING,
  METRIC_MAPPING,
  MORE_SCENES_MAPPING,
  SCENES_MAPPING,
  TABLE_MAPPING,
} from "@/constants";
import { formatDate } from "@/utils/timeFormatter";
import usePutExperiment from "@/customHooks/usePutExperiments";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DataItemRequest | null;
  onSave: (updatedItem: DataItemRequest) => void;
}

const showToast = ({
  type,
  title,
  message,
  icon,
}: {
  type: string;
  title: string;
  message: string;
  icon: React.ReactNode;
}) => {
  toast.custom(
    (id) => (
      <div
        className={`flex items-center gap-3 p-4 rounded-lg shadow-sm ${
          type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div
          className={`flex-shrink-0 p-1 rounded-full ${
            type === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {icon}
        </div>
        <div>
          <h3
            className={`font-medium ${
              type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm ${
              type === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className={`ml-auto ${
            type === "success"
              ? "text-green-500 hover:text-green-700"
              : "text-red-500 hover:text-red-700"
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: 4000 }
  );
};

export default function EditModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState<Partial<DataItemTable>>({});
  const { mutate: updatedData } = usePutExperiment();

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number.parseFloat(value)
          : value,
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = formData.id?.toString();
    if (item && id) {
      const data = {
        ...item,
        ...formData,
      };
      updatedData(
        { id, data },
        {
          onSuccess: () => {
            showToast({
              type: "success",
              title: "Actualizado éxitosamente",
              message: `La información del experimento ${data.title} ha sido actualizada`,
              icon: <Check className="h-5 w-5 text-green-600" />,
            });
          },
          onError: () => {
            showToast({
              type: "error",
              title: "Error al actualizar",
              message: `Hubo un error al actualizar la información del experimento ${data.title}`,
              icon: <X className="h-5 w-5 text-red-600" />,
            });
          },
        }
      );
      onSave(data);
    }
    onClose();
  };

  if (!item) return null;

  // Group fields by type for better organization
  const textFields = ["scene_type", "title", "dataset"];
  const booleanFields = Object.keys(SCENES_MAPPING);
  const moreBooleanFields = Object.keys(MORE_SCENES_MAPPING);
  const numericFields = Object.keys(METRIC_MAPPING);
  const datesFields = Object.keys(DATES_MAPPING);

  const typeOptions = ["image", "video"];
  const modelOptions = ["NeRF", "Gaussian"];
  const preprocessorOptions = ["COLMAP", "HLOC"];

  const selectFields = [
    { name: "type", options: typeOptions },
    { name: "model", options: modelOptions },
    { name: "preprocessor", options: preprocessorOptions },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información básica</h3>
                <div className="space-y-2">
                  <Label htmlFor={"id"}>{TABLE_MAPPING["id"]}</Label>
                  <Input
                    id={"id"}
                    name={"id"}
                    value={
                      (formData["id" as keyof DataItemTable] as string) || ""
                    }
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                </div>
                {textFields.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {TABLE_MAPPING[field as keyof typeof TABLE_MAPPING]}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      value={
                        (formData[field as keyof DataItemTable] as string) || ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                ))}
                {selectFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {TABLE_MAPPING[field.name as keyof typeof TABLE_MAPPING]}
                    </Label>
                    <Select
                      value={
                        (formData[
                          field.name as keyof DataItemTable
                        ] as string) || ""
                      }
                      onValueChange={(value) =>
                        handleSelectChange(field.name, value)
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue
                          placeholder={`Seleccionar ${
                            TABLE_MAPPING[
                              field.name as keyof typeof TABLE_MAPPING
                            ]
                          }`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tipos de Escena</h3>
                  {booleanFields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={Boolean(
                          formData[field as keyof DataItemTable]
                        )}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(field, Boolean(checked))
                        }
                      />
                      <Label htmlFor={field}>
                        {TABLE_MAPPING[field as keyof typeof TABLE_MAPPING]}
                      </Label>
                    </div>
                  ))}
                </div>
                <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />
                <div className="space-y-4">
                  <h3 className="text-md font-medium">
                    Otra Categorización de Escena
                  </h3>
                  {moreBooleanFields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={Boolean(
                          formData[field as keyof DataItemTable]
                        )}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(field, Boolean(checked))
                        }
                      />
                      <Label htmlFor={field}>
                        {TABLE_MAPPING[field as keyof typeof TABLE_MAPPING]}
                      </Label>
                    </div>
                  ))}
                </div>
                <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Actualizaciones</h3>
                  {datesFields.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>
                        {TABLE_MAPPING[field as keyof typeof TABLE_MAPPING]}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={formatDate(
                          formData[field as keyof DataItemTable] as string
                        )}
                        disabled
                        className="bg-muted text-muted-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Métricas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {numericFields.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {TABLE_MAPPING[field as keyof typeof TABLE_MAPPING]}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      type="number"
                      step={
                        field.includes("std") ||
                        field.includes("ratio") ||
                        field === "psnr" ||
                        field === "ssim" ||
                        field === "lpips"
                          ? "0.001"
                          : "1"
                      }
                      value={
                        (formData[field as keyof DataItemTable] as number) || 0
                      }
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
