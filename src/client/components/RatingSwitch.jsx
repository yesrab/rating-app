import React, { useEffect, useState } from "react";

const RatingSwitch = ({ getValue, row, column, table }) => {
  const initialVal = getValue();
  const [selectedValue, setSelectedValue] = useState(initialVal);

  const handleRatingChange = (e) => {
    setSelectedValue(e.target.value);
    onBlur();
  };

  useEffect(() => {
    setSelectedValue(initialVal);
  }, [initialVal]);
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, selectedValue);
  };
  return (
    <select
      // onBlur={onBlur}
      className='w-full text-center rounded-md'
      name='rating'
      id='rating'
      value={selectedValue}
      onChange={handleRatingChange}
    >
      <option value='0'>0</option>
      <option value='1'>1</option>
      <option value='2'>2</option>
      <option value='3'>3</option>
      <option value='4'>4</option>
      <option value='5'>5</option>
    </select>
  );
};

export default RatingSwitch;
