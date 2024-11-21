import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Plus, Minus, Stethoscope, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const prescriptionSchema = z.object({
  diseaseName: z.string().min(1, "Disease name is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  medicationDetails: z.array(
    z.object({
      medication: z.string().min(1, "Medication is required"),
      frequency: z.string().min(1, "Frequency is required"),
    })
  ),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("disease");

  const form = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      diseaseName: "",
      symptoms: "",
      medicationDetails: [{ medication: "", frequency: "" }],
      note: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medicationDetails",
  });

  const handleSubmit = async (data: PrescriptionForm) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        DiseaseName: data.diseaseName,
        Symptoms: data.symptoms,
        MedicationDetails: JSON.stringify(data.medicationDetails),
        Note: data.note,
      };

      await onSubmit(formattedData);
      form.reset();
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : JSON.stringify(axiosError.response?.data) ||
            "Failed to save prescription";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const medications = [
    "Amoxicillin",
    "Metronidazole",
    "Melafix",
    "Kanamycin",
    "Erythromycin",
    "Furan-2",
    "Seachem Paraguard",
    "Tetracycline",
    "Pimafix",
    "Copper Sulfate",
    "Salt Bath Treatment",
    "Praziquantel",
    "Levamisole",
    "API General Cure",
    "Clindamycin",
  ];

  const frequencies = [
    "Once a day",
    "Twice a day",
    "Three times a day",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "Every 24 hours",
    "Once every 2 days",
    "Once a week",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <Stethoscope className="w-6 h-6" />
            Create Prescription
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="disease">Disease</TabsTrigger>
                <TabsTrigger value="medication">Medication</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="disease" className="mt-4">
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="diseaseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disease Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter disease name"
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="symptoms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Symptoms</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe the symptoms"
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="medication" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <ScrollArea className="h-[300px] pr-4 mb-4">
                      <div className="space-y-4">
                        <FormLabel className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                          <Pill className="w-5 h-5" />
                          Medication Details
                        </FormLabel>
                        <AnimatePresence>
                          {fields.map((field, index) => (
                            <motion.div
                              key={field.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="grid gap-4"
                            >
                              <div className="grid gap-4">
                                <FormField
                                  control={form.control}
                                  name={`medicationDetails.${index}.medication`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Medication</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select medication" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {medications.map((medication) => (
                                            <SelectItem
                                              key={medication}
                                              value={medication}
                                            >
                                              {medication}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`medicationDetails.${index}.frequency`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Frequency</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select frequency" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {frequencies.map((frequency) => (
                                            <SelectItem
                                              key={frequency}
                                              value={frequency}
                                            >
                                              {frequency}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  remove(index); // Xóa trường hiện tại
                                  // Đảm bảo giá trị đồng bộ sau khi xóa
                                  const medicationDetails =
                                    form.getValues("medicationDetails");
                                  console.log(
                                    "Updated Medication Details after remove:",
                                    medicationDetails
                                  );
                                }}
                                className="w-full"
                              >
                                <Minus className="w-4 h-4 mr-2" />
                                Remove Medication
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const allFieldsValid = fields.every((field, index) => {
                          const currentValues = form.getValues(
                            `medicationDetails.${index}`
                          );
                          return (
                            currentValues?.medication?.trim() !== "" &&
                            currentValues?.frequency?.trim() !== ""
                          );
                        });

                        if (allFieldsValid) {
                          append({ medication: "", frequency: "" });
                        } else {
                          toast.error(
                            "Please complete all Medication Details before adding a new one."
                          );
                        }
                      }}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medication
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Note
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Add any special instructions"
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Prescription"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
