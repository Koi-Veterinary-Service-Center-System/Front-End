"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Fish, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Prescription } from "@/types/info";
import api from "@/configs/axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FishPrescriptionSystem() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] =
    useState<Prescription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields states
  const [bookingID, setBookingID] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [fishSpecies, setFishSpecies] = useState("");
  const [medication, setMedication] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diseaseName, setDiseaseName] = useState("");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newPrescription: Prescription = {
      id: currentPrescription ? currentPrescription.id : Date.now(),
      bookingID,
      ownerName,
      fishSpecies,
      medication,
      frequency,
      duration,
      note,
      symptoms,
      diseaseName,
    };

    try {
      if (currentPrescription) {
        // Update existing prescription
        await api.put(
          `pres-rec/update/${currentPrescription.id}`,
          newPrescription
        );
      } else {
        // Add new prescription
        await api.post("pres-rec/create-presRec", newPrescription);
      }
      toast.success("Prescription has been saved successfully.");
      fetchPrescriptions(); // Refresh list after save
      setIsDialogOpen(false);
      resetForm(); // Clear form after submission
    } catch (error) {
      toast.error(error.message || "Failed to save the prescription!");
    } finally {
      setIsSubmitting(false);
      setCurrentPrescription(null);
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setCurrentPrescription(prescription);
    setBookingID(prescription.bookingID);
    setOwnerName(prescription.ownerName);
    setFishSpecies(prescription.fishSpecies);
    setMedication(prescription.medication);
    setFrequency(prescription.frequency);
    setDuration(prescription.duration);
    setNote(prescription.note);
    setSymptoms(prescription.symptoms);
    setDiseaseName(prescription.diseaseName);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setBookingID("");
    setOwnerName("");
    setFishSpecies("");
    setMedication("");
    setFrequency("");
    setDuration("");
    setNote("");
    setSymptoms("");
    setDiseaseName("");
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
                    onClick={() => {
                      setCurrentPrescription(null);
                      resetForm();
                    }}
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
                    <Input
                      type="text"
                      name="bookingID"
                      placeholder="Booking ID"
                      value={bookingID}
                      onChange={(e) => setBookingID(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      name="ownerName"
                      placeholder="Owner's Name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      name="fishSpecies"
                      placeholder="Fish Species"
                      value={fishSpecies}
                      onChange={(e) => setFishSpecies(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      name="medication"
                      placeholder="Medication"
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                      required
                    />
                    <Select
                      onValueChange={(value) => setFrequency(value)}
                      value={frequency}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Frequency</SelectLabel>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="twice-daily">
                            Twice daily
                          </SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="as-needed">As Needed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      name="duration"
                      placeholder="Duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                    />
                    <Textarea
                      name="note"
                      placeholder="Notes"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <Textarea
                      name="symptoms"
                      placeholder="Symptoms"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                    <Input
                      type="text"
                      name="diseaseName"
                      placeholder="Disease Name"
                      value={diseaseName}
                      onChange={(e) => setDiseaseName(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? "Saving..." : "Save Prescription"}
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
