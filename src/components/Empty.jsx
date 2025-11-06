function Empty({ title }) {
  return (
    <div className="flex h-[calc(100vh-150px)] w-full flex-col items-center justify-center text-center">
      <p className="text-2xl font-medium text-[#6D7A86]">{title}</p>
    </div>
  );
}

export default Empty;
