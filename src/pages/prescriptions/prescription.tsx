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
  Send,
  AlertTriangle,
  FileText,
  Stethoscope,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Prescription {
  id: number;
  bookingID: string;
  ownerName: string;
  fishSpecies: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  note: string;
  symptoms: string;
  diseaseName: string;
}

export default function FishPrescriptionSystem() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 1,
      bookingID: "BOOK001",
      ownerName: "John Doe",
      fishSpecies: "Goldfish",
      medication: "Aqua-Mox",
      dosage: "5ml",
      frequency: "daily",
      duration: "7 days",
      note: "Administer with care",
      symptoms: "Loss of appetite, lethargy",
      diseaseName: "Fin rot",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] =
    useState<Prescription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
      dosage: formData.get("dosage") as string,
      frequency: formData.get("frequency") as string,
      duration: formData.get("duration") as string,
      note: formData.get("note") as string,
      symptoms: formData.get("symptoms") as string,
      diseaseName: formData.get("diseaseName") as string,
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
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
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
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
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
                          defaultValue={currentPrescription?.bookingID}
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
                          defaultValue={currentPrescription?.ownerName}
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
                        defaultValue={currentPrescription?.fishSpecies}
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
                        <div className="relative mt-1">
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
                        <div className="relative mt-1">
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
                          id="frequency"
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
                        <div className="relative mt-1">
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
                        defaultValue={currentPrescription?.note}
                        className="mt-1"
                      ></Textarea>
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
                        defaultValue={currentPrescription?.symptoms}
                        className="mt-1"
                      ></Textarea>
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
                        defaultValue={currentPrescription?.diseaseName}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
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
                          {currentPrescription ? "Update" : "Create"}{" "}
                          Prescription
                        </>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence>
              {prescriptions.map((prescription) => (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-600">
                        {prescription.ownerName}'s {prescription.fishSpecies}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Booking ID: {prescription.bookingID}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(prescription)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(prescription.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Medication:</span>{" "}
                      {prescription.medication}
                    </div>
                    <div className="flex items-center">
                      <Droplet className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Dosage:</span>{" "}
                      {prescription.dosage}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Frequency:</span>{" "}
                      {prescription.frequency}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Duration:</span>{" "}
                      {prescription.duration}
                    </div>
                  </div>
                  <div className="mt-4 text-sm bg-blue-50 p-3 rounded-md">
                    <div className="flex items-start mb-2">
                      <FileText className="h-4 w-4 mr-2 text-blue-500 mt-1" />
                      <div>
                        <span className="font-medium  text-blue-700">
                          Note:
                        </span>{" "}
                        {prescription.note}
                      </div>
                    </div>
                    <div className="flex items-start mb-2">
                      <Stethoscope className="h-4 w-4 mr-2 text-blue-500 mt-1" />
                      <div>
                        <span className="font-medium text-blue-700">
                          Symptoms:
                        </span>{" "}
                        {prescription.symptoms}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium text-blue-700">
                        Disease:
                      </span>{" "}
                      {prescription.diseaseName}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4"
          >
            <Alert variant="default" className="bg-green-100 border-green-500">
              <AlertTriangle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Prescription has been{" "}
                {currentPrescription ? "updated" : "created"} successfully.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
