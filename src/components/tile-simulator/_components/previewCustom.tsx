"use client";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Clock, Share2 } from "lucide-react";
import Image from "next/image";
// import Image from "next/image";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PreviewCustom = () => {
  const [quantityUnit, setQuantityUnit] = useState("Sqft.");

  return (
    <div>
      <div className="mt-10 mx-[135px] mb-10">
        <div className="flex justify-between">
          <Button className="py-4 px-16 bg-transparent border border-[#CE3837] text-[#CE3837]">
            Go Back
          </Button>
          <h3 className="text-[#595959] font-normal text-[32px]">
            Preview Your Custom Tile
          </h3>
          <div className="flex gap-6">
            <div className="flex flex-col justify-center items-center gap-2">
              <Share2 className="w-6 h-6" />
              <p className="font-medium text-base">Share</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <ArrowDownToLine className="w-6 h-6" />
              <p className="font-medium text-base">Download SVG</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-10">
          <div className=" rounded-lg p-4 shadow-sm w-full max-w-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                Pattern: rabbits
              </span>
            </div>
            <div className="mt-2">
              <span className="text-gray-700 font-medium">Colors:</span>
              <div className="flex items-center space-x-4 mt-1">
                {[
                  "#FFFFFF",
                  "#D71E1E",
                  "#1ACC1E",
                  "#FFFFFF",
                  "#FFFFFF",
                  "#FFFFFF",
                ].map((color, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-1 cursor-pointer"
                  >
                    <input type="radio" name="color" className="hidden peer" />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-black">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/BoxLogo.png"
              width={100}
              height={100}
              alt="logo"
              className="w-12 h-12"
            />
          </div>
        </div>
        <div className="mt-[30px] flex flex-col justify-center items-center gap-[30px]">
          <div className="flex gap-[30px] ">
            <Image
              src="/tiles1.png"
              className="max-w-[562px] max-h-[514px] rounde-[8px] "
              width={562}
              height={514}
              alt="tiles"
            />
            <Image
              src="/tiles2.png"
              className="max-w-[562px] max-h-[514px] rounde-[8px] "
              width={562}
              height={514}
              alt="tiles"
            />
          </div>
          <div>
            <Image
              src="/Frame.png"
              className="w-[1154px] h-[500px] rounde-[8px] "
              width={562}
              height={514}
              alt="tiles"
            />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-2xl mt-8 text-center">
            Thank you for choosing to create a one-of-a-kind LiLi custom cement
            tile!
          </h3>
          <div className="mt-10">
            <h4 className="font-medium text-2xl text-center">
              Custom Design Process
            </h4>
            <div className="flex justify-between mt-10">
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/a-creative-designs.png"
                  alt=""
                  width={143}
                  height={140}
                />
                <p className="font-medium text-2xl">Color chips sent to you</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/a-creative-designs1.png"
                  alt=""
                  width={183}
                  height={140}
                />
                <p className="font-medium text-2xl">Factory sample photo $15</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/a-creative-designs2.png"
                  alt=""
                  width={140}
                  height={140}
                />
                <p className="font-medium text-2xl">
                  Physical sample 4 pieces $400
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/a-creative-designs3.png"
                  alt=""
                  width={168}
                  height={140}
                />
                <p className="font-medium text-2xl">
                  Order starts at only 10 boxes
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-[3px] border-[#595959] mt-6" />
        <div className="mt-6 flex justify-around">
          <div className="flex items-center gap-2 ">
            <Clock />
            <p className="font-normal text-[20px]">Next day</p>
          </div>
          <div className="flex items-center gap-2 ">
            <Clock />
            <p className="font-normal text-[20px]">1 week</p>
          </div>
          <div className="flex items-center gap-2 ">
            <Clock />
            <p className="font-normal text-[20px]">3 weeks</p>
          </div>
          <div className="flex items-center gap-2 ">
            <Clock />
            <p className="font-normal text-[20px]">12- 14 weeks</p>
          </div>
        </div>
          <div className="mt-14">

        <h3 className="font-medium text-base mb-2 ">Send yourself a copy</h3>
        <div className="flex flex-col justify-center items-center gap-14">
          <div className="w-full flex gap-[30px] ">
            <input
              type="text"
              placeholder="Enter your email"
              className="outline-none w-full border border-[#5A5A5A] rounded-md pl-5 py-4"
            />
            <Button className="font-medium text-base py-7 px-8 text-[16px] ">
              Send
            </Button>
          </div>
          <div>

          </div>
          <Dialog >
            <DialogTrigger asChild>
              <Button className="px-36 py-4 text-[16px] font-medium">
                Order A Sample
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-10 rounded-lg ">
              {/* Form Fields */}
              <div className="grid gap-3">
                {/* Name */}
                <div className="grid grid-cols-5 items-center gap-4">
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

              {/* reCAPTCHA */}
              <div className="flex justify-center my-4">
                <div className="border p-2 rounded-md w-full text-center">
                  <p>✅ Im not a robot</p>
                </div>
              </div>

              {/* Submit Button */}
              <DialogFooter>
                <Button className="bg-red-500 text-white w-full py-3 text-lg">
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
          </div>
      </div>
    </div>
  );
};

export default PreviewCustom;
