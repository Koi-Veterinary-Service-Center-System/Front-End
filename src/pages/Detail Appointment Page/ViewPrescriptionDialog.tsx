"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Pill,
  Stethoscope,
  FileText,
  Calendar,
} from "lucide-react";

interface Medication {
  medication: string;
  frequency: string;
}

interface Prescription {
  diseaseName: string;
  symptoms: string;
  medicationDetails: string;
  note?: string;
  createAt: string;
}

interface ViewPrescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptions: Prescription[] | null;
}

export function ViewPrescriptionDialog({
  isOpen,
  onClose,
  prescriptions = [],
}: ViewPrescriptionDialogProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const prescriptionsPerPage = 3;

  const totalPages = Math.ceil(
    (prescriptions?.length || 0) / prescriptionsPerPage
  );
  const currentPrescriptions =
    prescriptions?.slice(
      currentPage * prescriptionsPerPage,
      (currentPage + 1) * prescriptionsPerPage
    ) || [];

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] bg-gradient-to-br from-blue-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-blue-800 mb-4">
            Prescription Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <AnimatePresence mode="wait">
            {currentPrescriptions.map((prescription, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-blue-100">
                    <CardTitle className="text-xl text-blue-800 flex items-center space-x-2">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                      <span>{prescription.diseaseName || "N/A"}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Symptoms
                        </h4>
                        <p className="text-gray-700">
                          {prescription.symptoms || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                          <Pill className="w-4 h-4 mr-2" />
                          Medications
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {JSON.parse(
                            prescription.medicationDetails || "[]"
                          ).map((med: Medication, index: number) => (
                            <li key={index} className="text-gray-700">
                              <span className="font-medium">
                                {med.medication}
                              </span>
                              <Badge variant="secondary" className="ml-2">
                                {med.frequency}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Note
                      </h4>
                      <p className="text-gray-700">
                        {prescription.note || "N/A"}
                      </p>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(prescription.createAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {prescriptions?.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No prescriptions available.
            </div>
          )}
        </ScrollArea>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
