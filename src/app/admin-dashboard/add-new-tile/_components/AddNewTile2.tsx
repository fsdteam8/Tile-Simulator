"use client";
import React, { useState, useRef } from "react";
import axios from "axios";

interface TileType {
  name: string;
  description: string;
  grid_category: string;
  category_id: number[];
  image: File | null;
}

function ZabeerUpload() {
  const [formData, setFormData] = useState<TileType>({
    name: "",
    description: "",
    grid_category: "",
    category_id: [],
    image: null,
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const handleOnChangeEvent = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = event.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      category_id: value
        .split(",")
        .map((num) => parseInt(num.trim(), 10))
        .filter((num) => !isNaN(num)),
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("grid_category", formData.grid_category);
    formData.category_id.forEach((id) => {
      submissionData.append("category_id[]", id.toString());
    });
    if (formData.image) {
      submissionData.append("image", formData.image);
    }

    try {
      const res = await axios.post(
        `https://tilecustomizer.scaleupdevagency.com/api/tiles`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Upload Form</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleOnChangeEvent}
            placeholder="Enter name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="grid_category"
            value={formData.grid_category}
            onChange={handleOnChangeEvent}
            placeholder="Enter grid category"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="category_id"
            value={formData.category_id.join(",")}
            onChange={handleCategoryChange}
            placeholder="Enter category IDs (comma-separated)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleOnChangeEvent}
            placeholder="Enter description"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            ref={fileRef}
            name="image"
            onChange={handleOnChangeEvent}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ZabeerUpload;
