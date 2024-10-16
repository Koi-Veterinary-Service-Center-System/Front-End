import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Fish, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function FishPrescriptionSystem() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch prescriptions based on customer name
  const fetchPrescriptions = async (customerName = "") => {
    try {
      const endpoint = customerName
        ? `/pres-rec/list-preRec-CusName/${customerName}`
        : "/pres-rec/list";
      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setPrescriptions(response.data);
      } else {
        toast.error("Failed to fetch prescriptions.");
      }
    } catch (error) {
      toast.error("Failed to fetch prescriptions!");
    }
  };

  useEffect(() => {
    fetchPrescriptions(); // Fetch all prescriptions on component mount
  }, []);

  const handleSearch = () => {
    fetchPrescriptions(searchTerm);
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
              <Dialog open={false} onOpenChange={() => {}}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200">
                    <Plus className="mr-2 h-4 w-4" /> New Prescription
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-600">
                      New Prescription
                    </DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <div className="p-4">
            {/* Search input for customer name */}
            <div className="mb-4 flex items-center">
              <Input
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2"
              />
              <Button onClick={handleSearch} className="bg-blue-500 text-white">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Display fetched prescriptions */}
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <Card key={prescription.prescriptionRecordID} className="mb-4">
                  <CardHeader>
                    <CardTitle>Prescription Details</CardTitle>
                  </CardHeader>
                  <div className="p-4">
                    {prescription.createAt && (
                      <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(prescription.createAt).toLocaleString()}
                      </p>
                    )}
                    {prescription.frequency && (
                      <p>
                        <strong>Frequency:</strong> {prescription.frequency}
                      </p>
                    )}
                    {prescription.medication && (
                      <p>
                        <strong>Medication:</strong> {prescription.medication}
                      </p>
                    )}
                    {prescription.symptoms && (
                      <p>
                        <strong>Symptoms:</strong> {prescription.symptoms}
                      </p>
                    )}
                    {prescription.diseaseName && (
                      <p>
                        <strong>Disease Name:</strong>{" "}
                        {prescription.diseaseName}
                      </p>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No prescriptions found.
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
