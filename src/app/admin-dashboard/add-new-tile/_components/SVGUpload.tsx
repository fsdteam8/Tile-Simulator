
// "use client"

// import type React from "react"

// import { useCallback, useState } from "react"
// import { useDropzone } from "react-dropzone"
// import { UploadCloud, X, FileImage, Check } from "lucide-react"

// interface SVGUploadProps {
//   onUpload: (data: File | null) => void
//   maxSizeKB?: number
// }

// const SVGUpload = ({ onUpload, maxSizeKB = 500 }: SVGUploadProps) => {
//   const [preview, setPreview] = useState<string | null>(null)
//   const [fileName, setFileName] = useState<string | null>(null)
//   const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const file = acceptedFiles[0]
//       if (file) {
//         // Reset error state
//         setErrorMessage(null)

//         // Check file size
//         if (file.size > maxSizeKB * 1024) {
//           setErrorMessage(`File size exceeds ${maxSizeKB} KB. Please upload a smaller SVG file.`)
//           setUploadStatus("error")
//           return
//         }

//         setFileName(file.name)
//         setUploadStatus("idle")

//         const reader = new FileReader()
//         reader.onload = (event) => {
//           if (event.target?.result) {
//             try {
//               const svgData = event.target.result as string

//               // Enhanced SVG validation
//               if (!svgData.includes("<svg") || !svgData.includes("</svg>")) {
//                 setErrorMessage("Not a valid SVG file. Please check the file format.")
//                 setUploadStatus("error")
//                 return
//               }

//               // Additional security check for potentially harmful content
//               if (svgData.includes("<script") || svgData.includes("javascript:")) {
//                 setErrorMessage("SVG contains potentially unsafe content.")
//                 setUploadStatus("error")
//                 return
//               }

//               setPreview(svgData)
//               setUploadStatus("success")

//               if (typeof onUpload === "function") {
//                 onUpload(file)
//               } else {
//                 console.error("onUpload is not a function", onUpload)
//                 setErrorMessage("Upload handler error. Please try again.")
//                 setUploadStatus("error")
//               }
//             } catch (error) {
//               console.error("Error processing SVG:", error)
//               setErrorMessage("Failed to process SVG file. Please try another file.")
//               setUploadStatus("error")
//             }
//           }
//         }

//         reader.onerror = () => {
//           setErrorMessage("Failed to read file. Please try again.")
//           setUploadStatus("error")
//         }

//         reader.readAsText(file)
//       }
//     },
//     [onUpload, maxSizeKB],
//   )

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { "image/svg+xml": [".svg"] },
//     onDrop,
//     maxFiles: 1,
//   })

//   const handleRemove = (e: React.MouseEvent) => {
//     e.stopPropagation()
//     setPreview(null)
//     setFileName(null)
//     setUploadStatus("idle")
//     setErrorMessage(null)
//     onUpload(null)
//   }

//   return (
//     <div
//       {...getRootProps()}
//       className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
//         isDragActive
//           ? "border-primary bg-primary/5"
//           : uploadStatus === "error"
//             ? "border-red-500 bg-red-50"
//             : uploadStatus === "success" && preview
//               ? "border-green-500 bg-green-50"
//               : "border-gray-300 bg-gray-50 hover:border-gray-400"
//       }`}
//       role="button"
//       tabIndex={0}
//       aria-label="SVG upload area"
//     >
//       <input {...getInputProps()} aria-label="Upload SVG file" />

//       {preview ? (
//         <div className="flex flex-col items-center">
//           <div className="relative w-full max-w-xs mx-auto mb-4">
//             {/* SVG Preview Container with fixed aspect ratio */}
//             <div className="relative w-full pt-[100%] bg-white rounded-md shadow-sm overflow-hidden">
//               {/* SVG Content positioned absolutely to fill container */}
//               <div
//                 className="absolute inset-0 flex items-center justify-center p-4"
//                 dangerouslySetInnerHTML={{ __html: preview }}
//                 aria-label="SVG preview"
//               />
//             </div>

//             {/* Status indicator */}
//             <div className="absolute top-2 right-2">
//               {uploadStatus === "success" ? (
//                 <div className="bg-green-500 text-white p-1 rounded-full">
//                   <Check size={16} />
//                 </div>
//               ) : uploadStatus === "error" ? (
//                 <div className="bg-red-500 text-white p-1 rounded-full">
//                   <X size={16} />
//                 </div>
//               ) : null}
//             </div>

//             {/* Remove button */}
//             <button
//               type="button"
//               onClick={handleRemove}
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
//               aria-label="Remove uploaded SVG"
//             >
//               <X size={16} />
//             </button>
//           </div>

//           {/* File name */}
//           {fileName && (
//             <div className="flex items-center text-sm text-gray-600 mt-2">
//               <FileImage size={16} className="mr-2" />
//               <span className="truncate max-w-[200px]">{fileName}</span>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center text-center">
//           <div className={`p-4 rounded-full mb-4 ${isDragActive ? "bg-primary/10" : "bg-gray-100"}`}>
//             <UploadCloud className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-gray-500"}`} />
//           </div>

//           <h3 className="text-lg font-medium text-gray-700 mb-1">{isDragActive ? "Drop SVG here" : "Upload SVG"}</h3>

//           <p className="text-sm text-gray-500 mb-4">Drag and drop your SVG file here, or click to browse</p>

//           <button
//             type="button"
//             className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
//           >
//             Select SVG
//           </button>

//           <p className="text-xs text-gray-400 mt-4">Only SVG files are accepted (max {maxSizeKB}KB)</p>
//         </div>
//       )}

//       {/* Error message display */}
//       {errorMessage && (
//         <div className="mt-3 text-red-500 text-sm" role="alert">
//           {errorMessage}
//         </div>
//       )}
//     </div>
//   )
// }

// export default SVGUpload



"use client";

import { useCallback, useState, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SVGUploadProps {
  onUpload: (file: File | null) => void;
  maxSizeKB: number;
  initialImage?: string; // Add this prop
}

const SVGUpload = ({ onUpload, maxSizeKB, initialImage }: SVGUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImage || null // Initialize with the initialImage if provided
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(file)

  const handleChange = useCallback(
    (file: File) => {
      if (file.size > maxSizeKB * 1024) {
        alert(`File size should be less than ${maxSizeKB}KB`);
        return;
      }

      setFile(file);
      onUpload(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [maxSizeKB, onUpload]
  );

  const handleRemove = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onUpload]);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-[#B0B0B0] rounded-[8px] relative">
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain p-4"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-white hover:bg-gray-100"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={["SVG"]}
            maxSize={maxSizeKB}
            minSize={0}
            label="Drag & drop your SVG file here or click to browse"
            hoverTitle="Drop here"
            classes="w-full h-full flex items-center justify-center cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-gray-500">
                Drag & drop your SVG file here or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Max file size: {maxSizeKB}KB
              </p>
            </div>
          </FileUploader>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept=".svg"
        onChange={(e) => e.target.files?.[0] && handleChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default SVGUpload;

