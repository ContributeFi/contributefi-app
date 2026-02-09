import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function CustomInput({
  label,
  placeholder,
  prefix,
  type = "text",
  className = "",
  icon,
  handleRevealPassword,
  error,
  token,
  ...props
}) {
  return (
    <Label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
      {label}
      {prefix ? (
        <div className="relative h-[48px] w-full rounded-[12px]">
          <span className="absolute top-0 bottom-0 left-0 flex h-full items-center rounded-l-sm bg-[#EDF2FF] px-4 pt-2 text-sm text-[#8791A7]">
            {prefix}
          </span>

          <Input
            type={type}
            placeholder={placeholder}
            className={`h-full rounded-[12px] border-none bg-[#F7F9FD] px-4 pl-24 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-[#aab1c1] ${className}`}
            {...props}
          />
          {icon && (
            <span
              onClick={() => handleRevealPassword()}
              className="absolute top-0 right-0 bottom-0 flex h-full items-center rounded-l-sm bg-[#EDF2FF] px-4 pt-2 text-sm text-[#8791A7]"
            >
              {icon}
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="relative h-[48px] w-full rounded-[12px]">
            <Input
              type={type}
              placeholder={placeholder}
              className={`h-full rounded-[12px] border-none bg-[#F7F9FD] px-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-[#ebedf0] ${className}`}
              {...props}
            />
            {icon && (
              <span
                onClick={() => handleRevealPassword()}
                className="absolute top-0 right-0 bottom-0 flex cursor-pointer items-center px-4 text-2xl text-[#B2B9C7]"
              >
                {icon}
              </span>
            )}
            {token && (
              <span className="absolute top-0 bottom-0 left-0 flex h-full w-[25%] items-center rounded-l-sm bg-[#EDF2FF] px-4 pt-2 text-sm text-[#8791A7]">
                {token}
              </span>
            )}
          </div>
        </>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}
    </Label>
  );
}
