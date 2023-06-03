const Sum = ({ parts }) => {
    //Make an array into a single value by adding the exercises of each part
    const sum = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <p><b>Total of {sum} exercises</b></p>
    )
}

export default Sum;

