import { FaCloudUploadAlt } from "react-icons/fa";
import { useId } from "react";

export default function FileUpload({
  description = "PNG, JPG up to 5MB",
  buttonText = "Upload Photo",
  accept = "image/png, image/jpeg",
  className = "",
  ...props
}) {
  const id = useId();

  return (
    <div
      className={`h-[80px] w-full cursor-pointer rounded-[4px] border border-dashed border-[#B2B9C766] bg-[#F7F9FD] text-center transition hover:bg-[#EFF2FA] ${className}`}
    >
      <input
        type="file"
        accept={accept}
        className="hidden"
        id={id}
        {...props}
      />
      <label
        htmlFor={id}
        className="flex h-full cursor-pointer flex-col items-center justify-center gap-2"
      >
        <div className="flex items-center gap-1">
          <FaCloudUploadAlt className="text-[#2F0FD1]" />
          <span className="font-medium text-[#2F0FD1]">{buttonText}</span>
        </div>

        {/* Description */}
        <p className="text-[14px] text-[#8E8E93]">{description}</p>
      </label>
    </div>
  );
}
