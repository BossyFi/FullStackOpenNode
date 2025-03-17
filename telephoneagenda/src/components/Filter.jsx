const Filter = ({value, onValueChange}) => {
    return (
        <>
            filter shown with<input value={value} onChange={onValueChange}/>
        </>
    )
}
export default Filter;