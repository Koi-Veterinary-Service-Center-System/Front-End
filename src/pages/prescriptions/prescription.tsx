"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fish,
  Pill,
  Droplet,
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Prescription {
  id: number;
  ownerName: string;
  fishSpecies: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function FishPrescriptionCRUD() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 1,
      ownerName: "John Doe",
      fishSpecies: "Goldfish",
      medication: "Aqua-Mox",
      dosage: "5ml",
      frequency: "daily",
      duration: "7 days",
      instructions: "Add to tank water daily",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] =
    useState<Prescription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newPrescription: Prescription = {
      id: currentPrescription ? currentPrescription.id : Date.now(),
      ownerName: formData.get("ownerName") as string,
      fishSpecies: formData.get("fishSpecies") as string,
      medication: formData.get("medication") as string,
      dosage: formData.get("dosage") as string,
      frequency: formData.get("frequency") as string,
      duration: formData.get("duration") as string,
      instructions: formData.get("instructions") as string,
    };

    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (currentPrescription) {
      setPrescriptions(
        prescriptions.map((p) =>
          p.id === currentPrescription.id ? newPrescription : p
        )
      );
    } else {
      setPrescriptions([...prescriptions, newPrescription]);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
    setCurrentPrescription(null);
  };

  const handleEdit = (prescription: Prescription) => {
    setCurrentPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPrescriptions(prescriptions.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-600 text-white flex justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 flex items-center">
              <Fish className="mr-2" /> Fish Prescriptions
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setCurrentPrescription(null)}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" /> New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {currentPrescription ? "Edit" : "New"} Prescription
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="ownerName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Owner's Name
                    </label>
                    <Input
                      type="text"
                      name="ownerName"
                      id="ownerName"
                      required
                      defaultValue={currentPrescription?.ownerName}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fishSpecies"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Fish Species
                    </label>
                    <Input
                      type="text"
                      name="fishSpecies"
                      id="fishSpecies"
                      required
                      defaultValue={currentPrescription?.fishSpecies}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="medication"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Medication
                    </label>
                    <div className="relative">
                      <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        name="medication"
                        id="medication"
                        required
                        className="pl-10"
                        defaultValue={currentPrescription?.medication}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="dosage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Dosage
                    </label>
                    <div className="relative">
                      <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        name="dosage"
                        id="dosage"
                        required
                        className="pl-10"
                        defaultValue={currentPrescription?.dosage}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="frequency"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Frequency
                    </label>
                    <Select
                      name="frequency"
                      id="frequency"
                      required
                      defaultValue={currentPrescription?.frequency || ""}
                    >
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="twice-daily">Twice Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="as-needed">As Needed</option>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duration
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        name="duration"
                        id="duration"
                        required
                        className="pl-10"
                        placeholder="e.g., 7 days"
                        defaultValue={currentPrescription?.duration}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="instructions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Special Instructions
                    </label>
                    <Textarea
                      name="instructions"
                      id="instructions"
                      rows={3}
                      defaultValue={currentPrescription?.instructions}
                    ></Textarea>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Send className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {currentPrescription ? "Update" : "Create"} Prescription
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <AnimatePresence>
              {prescriptions.map((prescription) => (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow rounded-lg p-4 mb-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {prescription.ownerName}'s {prescription.fishSpecies}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Medication: {prescription.medication}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(prescription)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(prescription.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Dosage:</span>{" "}
                      {prescription.dosage}
                    </div>
                    <div>
                      <span className="font-medium">Frequency:</span>{" "}
                      {prescription.frequency}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {prescription.duration}
                    </div>
                  </div>
                  {prescription.instructions && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Instructions:</span>{" "}
                      {prescription.instructions}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
