// CreatePrescriptionDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

const prescriptionSchema = z.object({
  diseaseName: z.string().min(1, "Disease name is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  medication: z.string().min(1, "Medication is required"),
  frequency: z.string().min(1, "Frequency is required"),
  note: z.string().optional(),
});

type PrescriptionForm = z.infer<typeof prescriptionSchema>;

interface CreatePrescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PrescriptionForm) => Promise<void>;
}

export function CreatePrescriptionDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreatePrescriptionDialogProps) {
  const form = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      diseaseName: "",
      symptoms: "",
      medication: "",
      frequency: "",
      note: "",
    },
  });

  const handleSubmit = async (data: PrescriptionForm) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) ||
            "Fail to save prescription";

      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create or Edit Prescription</DialogTitle>
          <DialogDescription>
            Fill out the form to create or edit the prescription.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              {/* Disease Name Field */}
              <FormField
                control={form.control}
                name="diseaseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disease Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Disease Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Symptoms Field */}
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Symptoms" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Medication Field */}
              <FormField
                control={form.control}
                name="medication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Medication" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Melafix - Antibacterial Remedy">
                            Melafix - Antibacterial Remedy
                          </SelectItem>
                          <SelectItem value="Pimafix - Antifungal Remedy">
                            Pimafix - Antifungal Remedy
                          </SelectItem>
                          <SelectItem value="Praziquantel - Parasite Treatment">
                            Praziquantel - Parasite Treatment
                          </SelectItem>
                          <SelectItem value="Formalin - General Antiparasitic">
                            Formalin - General Antiparasitic
                          </SelectItem>
                          <SelectItem value="Malachite Green - Antifungal and Parasitic Treatment">
                            Malachite Green - Antifungal and Parasitic Treatment
                          </SelectItem>
                          <SelectItem value="Salt - General Health Tonic">
                            Salt - General Health Tonic
                          </SelectItem>
                          <SelectItem value="Amoxicillin - Broad Spectrum Antibiotic">
                            Amoxicillin - Broad Spectrum Antibiotic
                          </SelectItem>
                          <SelectItem value="Erythromycin - Bacterial Infection Treatment">
                            Erythromycin - Bacterial Infection Treatment
                          </SelectItem>
                          <SelectItem value="Tetracycline - Bacterial Infection Treatment">
                            Tetracycline - Bacterial Infection Treatment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Frequency Select Field */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="thrice">
                          Three times daily
                        </SelectItem>
                        <SelectItem value="asNeeded">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Note Field */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Special Instructions" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save Prescription
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
