import { Search } from "lucide-react";

function CustomSearch({ placeholder, onSearchChange }) {
  return (
    <div className="relative max-w-[300px] flex-1 rounded-md border border-[#D0D5DD] px-[30px] py-2">
      <Search
        className="absolute top-1/2 left-2 -translate-y-1/2 text-[#8E8E93]"
        size={16}
      />
      <input
        type="text"
        placeholder={placeholder}
        onChange={onSearchChange}
        className="w-full rounded-md border-none bg-[lg:w-[300px] pl-1 text-[14px] text-[#667185] outline-none placeholder:text-[#8E8E93]"
      />
    </div>
  );
}

export default CustomSearch;
