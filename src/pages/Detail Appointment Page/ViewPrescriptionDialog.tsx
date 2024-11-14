import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableHeader,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Pill,
  Stethoscope,
  Clock,
  FileText,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface Prescription {
  diseaseName: string;
  symptoms: string;
  medication: string;
  frequency: string;
  note?: string;
}

interface ViewPrescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptions: Prescription[] | null; // Allow for null value
}

export function ViewPrescriptionDialog({
  isOpen,
  onClose,
  prescriptions = [], // Default to an empty array
}: ViewPrescriptionDialogProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const prescriptionsPerPage = 5;

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
      <DialogContent className="sm:max-w-[1200px] bg-gradient-to-br from-blue-100 to-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800 mb-4">
            Prescription Details
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <Table className="w-full table-fixed">
            <TableCaption>
              A list of prescriptions for the appointment.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%] font-semibold text-blue-700">
                  Disease Name
                </TableHead>
                <TableHead className="w-[30%] font-semibold text-blue-700">
                  Symptoms
                </TableHead>
                <TableHead className="w-[30%] font-semibold text-blue-700">
                  Medication
                </TableHead>
                <TableHead className="w-[15%] font-semibold text-blue-700">
                  Frequency
                </TableHead>
                <TableHead className="w-[20%] font-semibold text-blue-700">
                  Note
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {currentPrescriptions.map((prescription, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="overflow-hidden whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">
                          {prescription.diseaseName || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="overflow-hidden whitespace-nowrap">
                      <span className="truncate">
                        {prescription.symptoms || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="overflow-hidden whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Pill className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {prescription.medication}
                      </div>
                    </TableCell>
                    <TableCell className="overflow-hidden whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="truncate">
                          {prescription.frequency || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="overflow-hidden whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">
                          {prescription.note || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {prescriptions?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No prescriptions available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center space-x-2"
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
