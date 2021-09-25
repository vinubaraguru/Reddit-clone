interface InputGroupProps {
    className? : string
    type: string
    placeholder: string
    value: string
    error : string | undefined
    setValue: (str: string)=> void
}

const InputGroup: React.FC<InputGroupProps> = ({
    className,
    type,
    placeholder,
    value,
    error,
    setValue
}) =>{
    return (
        <div className={className}>
        <input type={type} 
          className="w-full px-3 py-2 bg-gray-100 border-gray-600 rounded" 
          placeholder={placeholder}
          value={value}
          onChange={e=>setValue(e.target.value)}
        />
        <small className="font-medium text-red-500">{error}</small>
      </div>
    )
}

export default InputGroup;