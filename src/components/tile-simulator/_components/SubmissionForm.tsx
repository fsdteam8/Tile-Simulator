"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";

//eslint
import ReCAPTCHA from "react-google-recaptcha";

interface SubmissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionForm({ open, onOpenChange }: SubmissionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    referredBy: "",
    quantityNeeded: "",
    quantityUnit: "Sqft.",
    otherSpecify: "",
    message: "",
  });

  function onChange(value: string | null) {
    console.log("Captcha value:", value);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, quantityUnit: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log each field individually for clarity
    console.log("========== FORM DATA SUBMISSION ==========");
    console.log("Name:", formData.name);
    console.log("Email:", formData.email);
    console.log("Phone Number:", formData.phoneNumber);
    console.log("Referred By:", formData.referredBy);
    console.log("Quantity:", formData.quantityNeeded, formData.quantityUnit);
    console.log("Other Specification:", formData.otherSpecify);
    console.log("Message:", formData.message);
    console.log("==========================================");

    // Log the complete object as well
    console.log("Complete Form Data Object:", formData);

    // Close the modal after submission
    onOpenChange(false);

    // You could add form validation and submission logic here
    alert("Form submitted! Check the console for the data.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="">
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 text-base font-medium text-[#CE3837] leading-[120%]"
          >
            <ChevronLeft className="text-[#CE3837]" /> Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name:</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-non"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number:</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referredBy">Referred By:</Label>
            <Input
              id="referredBy"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantityNeeded">Quantity Needed:</Label>
            <div className="flex gap-2">
              <Input
                id="quantityNeeded"
                name="quantityNeeded"
                value={formData.quantityNeeded}
                onChange={handleChange}
                className="rounded-md focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none leading-none flex-1"
              />
              <Select
                value={formData.quantityUnit}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-[120px] focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sqft.">Sqft.</SelectItem>
                  <SelectItem value="Meters">Meters</SelectItem>
                  <SelectItem value="Units">Units</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherSpecify">If Other, Please Specify:</Label>
            <Input
              id="otherSpecify"
              name="otherSpecify"
              value={formData.otherSpecify}
              onChange={handleChange}
              className="rounded-md focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none leading-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message:</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="rounded-md focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none min-h-[100px]"
            />
          </div>

          <div className="">
            <ReCAPTCHA
              sitekey="6LdJTCErAAAAAN2PcYOPlqK_a7W409uexqQ6kJLD"
              onChange={onChange}
            />
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-base font-medium leading-[120%] text-white px-16 py-4 rounded-[8px]"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
