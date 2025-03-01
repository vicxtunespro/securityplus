export default function InputField({label, type="text", name, handleChange, placeholder, value}){
    return(
        <div className="input-field flex flex-col gap-1 col-span-12 md:col-span-6 lg:col-span-4 w-full">
            <label className="text-sm text-slate-500">{label}</label>
            <div className="h-fit before:content-[' '] before:block before:w-1 before:h-inherit before:bg-blue-500 flex">
            <input className="w-full bg-slate-200 p-2 relative outline-0 focus:outline-none placeholder-slate-300"
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required
            />
            </div>
        </div>
    )
}