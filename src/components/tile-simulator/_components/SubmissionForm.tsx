"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

const SubmissionForm = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [quantityUnit, setQuantityUnit] = useState("Sqft.");
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <button onClick={() => onOpenChange(false)} className="flex items-center gap-2 text-base font-medium text-[#CE3837] leading-[120%]"> <ChevronLeft /> Back</button>
          <div className="grid gap-3 mt-6">
            {/* Name */}
            <div className="grid grid-cols-5 items-center gap-4 ">
              <Label htmlFor="name" className="col-span-1 ">
                Name:
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                className="col-span-4"
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="email" className="col-span-1 ">
                Email:
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="col-span-4"
              />
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="phone" className="col-span-1 ">
                Phone Number:
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                className="col-span-4"
              />
            </div>

            {/* Referred By */}
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="referredBy" className="col-span-1 ">
                Referred By:
              </Label>
              <Input
                id="referredBy"
                placeholder="Who referred you?"
                className="col-span-4"
              />
            </div>

            {/* Quantity Needed */}
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="quantity" className="col-span-1 ">
                Quantity Needed:
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  className="w-full"
                />
              </div>
              <select
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                className="border rounded-md px-2 py-1 col-span-1"
              >
                <option value="Sqft.">Sqft.</option>
                <option value="Units">Units</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* If Other, Please Specify */}
            {quantityUnit === "Other" && (
              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="otherQuantity" className="col-span-1 ">
                  If Other, Please Specify:
                </Label>
                <Input
                  id="otherQuantity"
                  placeholder="Specify quantity"
                  className="col-span-4"
                />
              </div>
            )}

            {/* Message */}
            <div className="grid grid-cols-5 items-start gap-4">
              <Label htmlFor="message" className="col-span-1 ">
                Message:
              </Label>
              <textarea
                id="message"
                placeholder="Enter any special requests"
                className="col-span-4 p-2 border rounded-md"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-center mt-10">
            <button className="text-base fotn-medium bg-primary text-white leading-[120%] py-[12px] px-[38px] rounded-[8px] cursor-pointer">
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionForm;
