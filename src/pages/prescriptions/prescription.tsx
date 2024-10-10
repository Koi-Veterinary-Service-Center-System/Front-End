"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fish,
  Pill,
  Droplet,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Send,
  AlertTriangle,
  FileText,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prescription } from "@/types/info";
import api from "@/configs/axios";

export default function FishPrescriptionSystem() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] =
    useState<Prescription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch prescriptions from the server
  const fetchPrescriptions = async () => {
    try {
      const response = await api.get("pres-rec/list");
      if (response.status === 200) {
        setPrescriptions(response.data);
      } else {
        toast.error("Failed to fetch prescriptions.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch prescriptions!");
    }
  };

  useEffect(() => {
    fetchPrescriptions(); // Fetch data on component mount
  }, []);

  const handleAddPrescription = async (values: Prescription) => {
    try {
      const response = await api.post("pres-rec/create-presRec", values);
      if (response.status === 200) {
        toast.success("Successfully added!");
        fetchPrescriptions(); // Refresh the list after adding
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to add the prescription.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add the prescription!");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newPrescription: Prescription = {
      id: currentPrescription ? currentPrescription.id : Date.now(),
      bookingID: formData.get("bookingID") as string,
      ownerName: formData.get("ownerName") as string,
      fishSpecies: formData.get("fishSpecies") as string,
      medication: formData.get("medication") as string,
      frequency: formData.get("frequency") as string,
      duration: formData.get("duration") as string,
      note: formData.get("note") as string,
      symptoms: formData.get("symptoms") as string,
      diseaseName: formData.get("diseaseName") as string,
    };

    if (currentPrescription) {
      // Update existing prescription
      setPrescriptions(
        prescriptions.map((p) =>
          p.id === currentPrescription.id ? newPrescription : p
        )
      );
    } else {
      // Add new prescription
      setPrescriptions([...prescriptions, newPrescription]);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
    setCurrentPrescription(null);
    toast.success("Prescription has been saved successfully.");
  };

  const handleEdit = (prescription: Prescription) => {
    setCurrentPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        const response = await api.delete(`pres-rec/delete/${id}`);
        if (response.status === 200) {
          toast.success("Prescription deleted successfully!");
          fetchPrescriptions(); // Refresh the list after deleting
        } else {
          toast.error("Failed to delete the prescription.");
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete the prescription!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold flex items-center">
                <Fish className="mr-2 h-8 w-8" /> Fish Prescription System
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setCurrentPrescription(null)}
                    className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Prescription
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-600">
                      {currentPrescription ? "Edit" : "New"} Prescription
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="bookingID"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Booking ID
                        </label>
                        <Input
                          type="text"
                          name="bookingID"
                          id="bookingID"
                          required
                          defaultValue={currentPrescription?.bookingID || ""}
                          className="mt-1"
                        />
                      </div>
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
                          defaultValue={currentPrescription?.ownerName || ""}
                          className="mt-1"
                        />
                      </div>
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
                        defaultValue={currentPrescription?.fishSpecies || ""}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="medication"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Medication
                        </label>
                        <Input
                          type="text"
                          name="medication"
                          id="medication"
                          required
                          defaultValue={currentPrescription?.medication || ""}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="dosage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Dosage
                        </label>
                        <Input
                          type="text"
                          name="dosage"
                          id="dosage"
                          required
                          defaultValue={currentPrescription?.dosage || ""}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="frequency"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Frequency
                        </label>
                        <Select
                          name="frequency"
                          required
                          defaultValue={currentPrescription?.frequency || ""}
                          className="mt-1"
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
                        <Input
                          type="text"
                          name="duration"
                          id="duration"
                          required
                          defaultValue={currentPrescription?.duration || ""}
                          className="mt-1"
                          placeholder="e.g., 7 days"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="note"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Note
                      </label>
                      <Textarea
                        name="note"
                        id="note"
                        rows={2}
                        defaultValue={currentPrescription?.note || ""}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="symptoms"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Symptoms
                      </label>
                      <Textarea
                        name="symptoms"
                        id="symptoms"
                        rows={2}
                        defaultValue={currentPrescription?.symptoms || ""}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="diseaseName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Disease Name
                      </label>
                      <Input
                        type="text"
                        name="diseaseName"
                        id="diseaseName"
                        required
                        defaultValue={currentPrescription?.diseaseName || ""}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Saving..."
                        : currentPrescription
                        ? "Update"
                        : "Create"}{" "}
                      Prescription
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          {/* Render the prescription cards */}
        </Card>
      </motion.div>
    </div>
  );
}
